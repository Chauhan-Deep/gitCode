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
                if (!cachedData['appdata']['submitted']) {
                    checkForFeedbackStatus = false;
                    salesforce.getAccessToken(getAccessTokenHandler);
                } else {
                    checkForVersion(cachedData['feedback']['Product_Version__c']);
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
                const filePath = { path: app.dir };
                const appModifiedDate = XPress.api.invokeApi('XTGetFileInfo', filePath);
                const date1904 = new Date(1904, 0, 1);
                const date1970 = new Date(1970, 0, 1);

                const dateDiff = date1970.getTime() - date1904.getTime();
                const currentDate = (Date.now() + dateDiff) / 1000;

                const daysDiff = daysBetween(appModifiedDate.mdate, currentDate);
                const appdata = cachedData.appdata;
                let days = 7;
                if (appdata) {
                    days = cachedData.appdata['days_rule'];
                    if (days) {
                        days = parseInt(days, 10);
                        if (isNaN(days)) {
                            days = 7;
                        }
                    }
                }

                if (daysDiff >= days) {
                    if (canShowDialog) {
                        showFeedbackDialog();
                    } else {
                        canShowDialog = true;
                    }
                }
            }
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
                if (!checkForFeedbackStatus) {
                    saveFeedbackStatus(false);
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
                        salesforce.getFeedback(responseJson.records[0].Id, getFeedbackHandler);
                    } else {
                        cachedData['feedback']['License__c'] = responseJson.records[0].Id;

                        salesforce.sendFeedback(JSON.stringify(cachedData.feedback), sendFeedbackHandler);
                    }
                } else {
                    if (!checkForFeedbackStatus) {
                        saveFeedbackStatus(false);
                    }
                }
            }
        }

        function sendFeedbackHandler(response) {
            console.log('SendFeedbackResponse: ' + response);
            const responseJson = JSON.parse(response);

            if (responseJson.request_status === SUCCESS) {
                if (responseJson.success) {
                    saveFeedbackStatus(true);
                } else {
                    saveFeedbackStatus(false);
                }
            } else {
                saveFeedbackStatus(false);
            }
        }

        function saveFeedbackStatus(isSubmitted) {
            cachedData['appdata']['submitted'] = isSubmitted;
            fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(cachedData));
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
                            'submitted': true,
                            'version_rule': 2,
                            'days_rule': 7
                        }
                        json.appdata = appdata;
                        fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(json));

                        cachedData = json;
                        checkForVersion(responseJson.records[0]['Product_Version__c']);
                    } else {
                        if (canShowDialog) {
                            showFeedbackDialog();
                        } else {
                            canShowDialog = true;
                        }
                    }
                } else if (responseJson.salesforce_error) {
                    console.log('Salesforce Error: ' + responseJson.salesforce_error);
                }
            }
        }

        function showFeedbackDialog() {
            if (alreadyChecked) {
                if (canShowDialog) {
                    canShowDialog = false;
                    let appUiFolder = XPress.api.invokeApi('XTGetApplicationWebDir', '').webDir;
                    const feedbackHtmlFile = appUiFolder + '/customer-engagements/Feedback/Feedback.html';

                    if (fs.existsSync(feedbackHtmlFile)) {
                        app.dialogs.openDialog('file:///' + feedbackHtmlFile, '', 'height=650,width=600,titlebar=no');
                    }
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
