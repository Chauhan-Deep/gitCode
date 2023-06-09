/*
File Type: JavaScript Library File
File Name: feedback.js
Description: 
*/
try {
    (function () {
        const SUCCESS = 1;
        const FEEDBACK_FILE = XPress.api.invokeApi('XTGetPreferencesDir', '').dir + '/Feedback.json';
        let cachedData;
        let checkForFeedbackStatus = false;
        let canShowDialog = false;
        let alreadyChecked = false;

        const FEEDBACK = {
            SUBMITTED: 1,
            NEVER_SHOW: 2,
            PENDING: 3,
            NOT_SUBMITTED: 4
        };

        checkForFeedback();
        //*****************====================================Functions used in the JavaScript===============================****************//

        /* Function to check for user feedback */
        function checkForFeedback() {
            console.log('Checking for feedback..........');
            if (!navigator.onLine) {
                return;
            }

            if (fs.existsSync(FEEDBACK_FILE)) {
                const jsonData = fs.readFileSync(FEEDBACK_FILE);
                if (jsonData) {
                    cachedData = JSON.parse(jsonData);
                }
            }

            if (cachedData && cachedData['appdata']) {
                switch (cachedData['appdata']['submitted']) {
                    case FEEDBACK.SUBMITTED:
                    case FEEDBACK.NEVER_SHOW: {
                        checkForVersion(cachedData['feedback']['Product_Version__c']);
                    }
                        break;
                    case FEEDBACK.PENDING: {
                        if (compareDays()) {
                            alreadyChecked = true;
                            canShowDialog = true;
                        }
                    }
                        break;
                    case FEEDBACK.NOT_SUBMITTED: {
                        const totalRetries = cachedData['appdata']['total_retries'];
                        const retry = cachedData['appdata']['retries'];

                        if (retry < totalRetries) {
                            checkForFeedbackStatus = false;
                            salesforce.getAccessToken(getAccessTokenHandler);
                        }
                    }
                        break;
                }
            } else {
                getFeedback();
            }
        }

        function checkForVersion(oldVersion) {
            alreadyChecked = true;
            const productInfo = XPress.api.invokeApi('XTGetProductInfo', '');
            const newVersion = productInfo.version;

            if (compareVersion(oldVersion, newVersion) === 1) {
                updateFeedbackStatus(FEEDBACK.PENDING);
            }
        }

        function compareDays() {
            const date1904 = new Date(1904, 0, 1);
            const date1970 = new Date(1970, 0, 1);
            const dateDiff = date1970.getTime() - date1904.getTime();
            const currentDate = (Date.now() + dateDiff) / 1000;

            let fileModifiedDate = currentDate;

            if (fs.existsSync(FEEDBACK_FILE)) {
                const filePath = { path: FEEDBACK_FILE };
                const fileDate = XPress.api.invokeApi('XTGetFileInfo', filePath);
                fileModifiedDate = fileDate.mdate;
            }

            const daysDiff = daysBetween(fileModifiedDate, currentDate);
            let days = 30;

            if (cachedData && cachedData['appdata']) {
                days = cachedData.appdata['days_rule'];
                if (days) {
                    days = parseInt(days, 10);
                    if (isNaN(days)) {
                        days = 30;
                    }
                }
            }

            if (daysDiff >= days) {
                return true;
            }

            return false;
        }

        function compareVersion(oldVersion, newVersion) {
            oldVersion = oldVersion.split('.');
            newVersion = newVersion.split('.');
            let versionLength = 2; //compare upto minor version
            const appdata = cachedData.appdata;
            if (appdata) {
                versionLength = cachedData.appdata['version_rule'];
                if (versionLength) {
                    versionLength = parseInt(versionLength, 10);
                    if (isNaN(versionLength)) {
                        versionLength = 2;
                    }
                }
            }

            for (let i = 0; i < versionLength; ++i) {
                oldVersion[i] = parseInt(oldVersion[i], 10);
                newVersion[i] = parseInt(newVersion[i], 10);
                if (oldVersion[i] > newVersion[i]) return -1;
                if (oldVersion[i] < newVersion[i]) return 1;
            }
            return oldVersion.length == newVersion.length ? 0 : (oldVersion.length < newVersion.length ? 1 : -1);
        }

        function daysBetween(date1, date2) {
            //Get 1 day in seconds
            var one_day = 60 * 60 * 24;

            // Calculate the difference in seconds
            var difference_sec = date2 - date1;

            // Convert back to days and return
            return Math.round(difference_sec / one_day);
        }

        function getFeedback() {
            checkForFeedbackStatus = true;
            salesforce.getAccessToken(getAccessTokenHandler);
        }

        function getAccessTokenHandler(response) {
            console.log('AccessTokenResponse: ' + response);

            if (JSON.parse(response).request_status === SUCCESS) {
                getLicense();
            } else {
                if (checkForFeedbackStatus) {
                    writeFeedbackStatus(FEEDBACK.PENDING);
                } else {
                    updateFeedbackStatus(FEEDBACK.NOT_SUBMITTED);
                }
            }
        }

        function getLicense() {
            const productInfo = XPress.api.invokeApi('XTGetProductInfo', '');
            salesforce.getLicense(productInfo.fullSerialNumber, getLicenseHandler);
        }

        function getLicenseHandler(response) {
            console.log('GetLicenseResponse: ' + response);
            const responseJson = JSON.parse(response);

            if (responseJson.request_status === SUCCESS) {
                if (responseJson.totalSize > 0) {
                    if (checkForFeedbackStatus) {
                        const userName = XPress.api.invokeApi('XTGetUserName', '').name;

                        salesforce.getFeedback(responseJson.records[0].Id, userName, getFeedbackHandler);
                    } else {
                        cachedData['feedback']['License__c'] = responseJson.records[0].Id;
                        cachedData['feedback']['Account__c'] = responseJson.records[0].Account__c;
                        
                        salesforce.sendFeedback(JSON.stringify(cachedData.feedback), sendFeedbackHandler);
                    }
                } else {
                    if (checkForFeedbackStatus) {
                        writeFeedbackStatus(FEEDBACK.PENDING);
                    } else {
                        updateFeedbackStatus(FEEDBACK.NOT_SUBMITTED);
                    }
                }
            }
        }

        function sendFeedbackHandler(response) {
            console.log('SendFeedbackResponse: ' + response);
            const responseJson = JSON.parse(response);

            if (responseJson.request_status === SUCCESS) {
                if (responseJson.success) {
                    updateFeedbackStatus(FEEDBACK.SUBMITTED);
                } else {
                    updateFeedbackStatus(FEEDBACK.NOT_SUBMITTED, true);
                }
            } else {
                updateFeedbackStatus(FEEDBACK.NOT_SUBMITTED);
            }
        }

        function updateFeedbackStatus(isSubmitted, updateRetryCount) {
            cachedData['appdata']['submitted'] = isSubmitted;
            if (updateRetryCount) {
                const retry = cachedData['appdata']['retries'];
                cachedData['appdata']['retries'] = retry + 1;
            }
            fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(cachedData));
        }

        function writeFeedbackStatus(status) {
            let json = {};
            const appdata = {
                'submitted': status,
                'version_rule': 2,
                'days_rule': 30,
                'total_retries': 5,
                'retries': 0
            }
            json.appdata = appdata;
            fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(json));
        }

        function getFeedbackHandler(response) {
            console.log('GetFeedbackResponse: ' + response);
            let responseJson = JSON.parse(response);

            if (responseJson.request_status === SUCCESS) {
                if (responseJson.done) {
                    alreadyChecked = true;
                    if (responseJson.totalSize > 0) {
                        let json = {};
                        json.feedback = responseJson.records[0];
                        const appdata = {
                            'submitted': FEEDBACK.SUBMITTED,
                            'version_rule': 2,
                            'days_rule': 30,
                            'total_retries': 5,
                            'retries': 0
                        }
                        json.appdata = appdata;
                        fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(json));

                        cachedData = json;
                        checkForVersion(responseJson.records[0]['Product_Version__c']);
                    } else {
                        let writeFile = true;
                        if (compareDays()) {
                            if (canShowDialog) {
                                writeFile = false;
                                showFeedbackDialog();
                            } else {
                                canShowDialog = true;
                            }
                        }
                        if (writeFile) {
                            writeFeedbackStatus(FEEDBACK.PENDING);
                        }
                    }
                } else if (responseJson.salesforce_error) {
                    console.log('Salesforce Error: ' + responseJson.salesforce_error);
                    writeFeedbackStatus(FEEDBACK.PENDING);
                }
            } else {
                writeFeedbackStatus(FEEDBACK.PENDING);
            }
        }

        function openDialog() {
            let appUiFolder = XPress.api.invokeApi('XTGetApplicationWebDir', '').webDir;
            const feedbackHtmlFile = appUiFolder + '/customer-engagements/Feedback/Feedback.html';

            if (fs.existsSync(feedbackHtmlFile)) {
                app.dialogs.openDialog('file:///' + feedbackHtmlFile + '?autoPopup=true', '', 'height=700,width=600,titlebar=no');
            }
        }

        function showFeedbackDialog() {
            if (alreadyChecked) {
                if (canShowDialog) {
                    canShowDialog = false;
                    openDialog();
                }
            } else {
                canShowDialog = true;
                checkForFeedback();
            }
        }

        XPress.showFeedbackDialog = showFeedbackDialog;
    })();
} catch (e) {
    console.log(e);
}
