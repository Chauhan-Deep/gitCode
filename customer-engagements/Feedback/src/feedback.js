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
            }
        } else {
            getFeedback();
        }
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

                    salesforce.sendFeedback(cachedData, sendFeedbackHandler);
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
            } else if (responseJson.salesforce_error) {
                const error = JSON.parse(responseJson.salesforce_error);
                if (error.errorCode === 'INVALID_QUERY_FILTER_OPERATOR') {
                    let appUiFolder = XPress.api.invokeApi('XTGetApplicationWebDir', '').webDir;
                    const feedbackHtmlFile = appUiFolder + '/customer-engagements/Feedback/Feedback.html';

                    if (fs.existsSync(feedbackHtmlFile)) {
                        app.dialogs.openDialog(feedbackHtmlFile, 'height=500,width=600,titlebar=no');
                    }
                }
            }
        }
    }

    XPress.checkForFeedback = checkForFeedback;
})();
