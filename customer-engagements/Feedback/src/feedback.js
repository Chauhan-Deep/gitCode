/*
File Type: JavaScript Library File
File Name: feedback.js
Description: 
*/

(function () {
    const SUCCESS = 1;
    const FEEDBACK_FILE = XPress.api.invokeApi('XTGetPreferencesDir', '').dir + '/Feedback.json';
    let cachedData;
    let checkForFeedbackStatus = false;

    // checkForFeedback();

    //*****************====================================Functions used in the JavaScript===============================****************//

    /* Function to check for user feedback */
    function checkForFeedback() {
        if (!navigator.onLine) {
            return;
        }
        if (fs.existsSync(FEEDBACK_FILE)) {
            cachedData = JSON.parse(fs.readFileSync(FEEDBACK_FILE));
            if (!cachedData.submitted) {
                checkForFeedbackStatus = false;
                salesforce.getAccessToken(getAccessTokenHandler);
            } else {
                checkForVersion(cachedData['Product_Version__c']);
            }
        } else {
            getFeedback();
        }
    }

    function checkForVersion(oldVersion) {
        const productInfo = XPress.api.invokeApi('XTGetProductInfo', '');
        const newVersion = productInfo.version;

        if (compareVersion(oldVersion, newVersion) === 1) {
            const filePath = { path: app.dir };
            const appModifiedDate = XPress.api.invokeApi('XTGetFileInfo', filePath);
            const date1904 = new Date(1904, 0, 1);
            const date1970 = new Date(1970, 0, 1);

            const dateDiff = date1970.getTime() - date1904.getTime();
            const currentDate = (Date.now() + dateDiff) / 1000;

            const daysDiff = Date.daysBetween(appModifiedDate, currentDate);
            if (daysDiff >= 7) {
                showFeedbackDialog();
            }
        }
    }

    function compareVersion(oldVersion, newVersion) {
        oldVersion = oldVersion.split('.');
        newVersion = newVersion.split('.');
        const versionLength = 2; //compare upto minor version

        for (let i = 0; i < versionLength; ++i) {
            oldVersion[i] = parseInt(oldVersion[i], 10);
            newVersion[i] = parseInt(newVersion[i], 10);
            if (oldVersion[i] > newVersion[i]) return -1;
            if (oldVersion[i] < newVersion[i]) return 1;
        }
        return oldVersion.length == newVersion.length ? 0 : (oldVersion.length < newVersion.length ? -1 : 1);
    }

    Date.daysBetween = function (date1, date2) {
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
                    cachedData['License__c'] = responseJson.records[0].Id;
                    delete cachedData['submitted'];

                    salesforce.sendFeedback(JSON.stringify(cachedData), sendFeedbackHandler);
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
        this.cachedData['submitted'] = isSubmitted;
        fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(this.cachedData));
    }

    function getFeedbackHandler(response) {
        console.log('GetFeedbackResponse: ' + response);
        let responseJson = JSON.parse(response);

        if (responseJson.request_status === SUCCESS) {
            if (responseJson.totalSize > 0) {
                responseJson.records[0]['submitted'] = true;
                fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(responseJson.records[0]));

                checkForVersion(responseJson.records[0]['Product_Version__c']);
            } else if (responseJson.salesforce_error) {
                const error = JSON.parse(responseJson.salesforce_error);
                if (error.errorCode === 'INVALID_QUERY_FILTER_OPERATOR') {
                    showFeedbackDialog();
                }
            }
        }
    }

    function showFeedbackDialog() {
        let appUiFolder = XPress.api.invokeApi('XTGetApplicationWebDir', '').webDir;
        const feedbackHtmlFile = appUiFolder + '/customer-engagements/Feedback/Feedback.html';

        if (fs.existsSync(feedbackHtmlFile)) {
            app.dialogs.openDialog(feedbackHtmlFile, 'height=500,width=600,titlebar=no');
        }
    }

    XPress.checkForFeedback = checkForFeedback;
})();
