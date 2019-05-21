import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class SalesforceService {

    constructor(private http: HttpClient) { }

    getToken() {
        const endpoint = 'https://test.salesforce.com/services/oauth2/token';
        const params = new HttpParams()
            .set('grant_type', 'password')
            .set('client_id', '3MVG9FG3dvS828gKFDfoJKyti9zOHk8r.bUryiB6AItf7sCP24EQv8qHRCT5hdIZij8hKOhsb9Sfz_0kzE11O')
            .set('client_secret', '2437904973704096585')
            .set('username', 'npsapiuser@quark.com')
            .set('password', 'Npsap1user7Hz1KqtAWP8TFCiNijOv02uMl');
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            params: params
        };

        return this.http.post<any>(endpoint, '', httpOptions);
    }

    getSerialNumber(token, serialNumber) {
        const endpoint = 'https://quarksoftware--playground.my.salesforce.com/services/data/v20.0/query/' +
            '?q=SELECT id from License__c where name=' + '\'' + serialNumber + '\'';
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            })
        };

        return this.http.get<any>(endpoint, httpOptions);
    }

    sendFeedback(token, userRating, userEmail, userComments, productVersion, productSerialNumber, productName, build) {
        const endpoint = 'https://quarksoftware--playground.my.salesforce.com/services/data/v20.0/sobjects/Product_Survey__c';
        const body = {
            'Comments__c': userComments,
            'Product_Version__c': productVersion,
            'User_Detail__c': userEmail,
            'Product_Score__c': userRating,
            'Build_Number__c': build,
            'License__c': productSerialNumber,
            'name': productName
        };
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            })
        };

        return this.http.post<any>(endpoint, body, httpOptions);
    }
}
