'use strict';

import { http, https } from 'follow-redirects'
import { winston } from './winston';

enum RequestMethod {
  GET = 'GET'
}

interface RequestOptions {
  hostname: string,
  path: string,
  method: RequestMethod,
  headers: object
}

export interface JsonResponseObject {
  statusCode: number,
  json: any,
}

export class JsonClient {
  endpoint: string;
  https: boolean;

  constructor(endpoint: string, https: boolean = true) {
    winston.debug('Creating JsonClient instance.');
    this.endpoint = endpoint;
    this.https = https;
  }

  getJson(path: string): Promise<JsonResponseObject> {
    const options: RequestOptions = this._getRequestOptions(path);

    return new Promise((fulfill, reject) => {
      this._handleJsonAPIRequest(options, fulfill, reject);
    });
  }

  _handleJsonAPIRequest(requestOptions: RequestOptions, fulfill: (responseObject: JsonResponseObject) => any, reject: () => any) {
    winston.debug('Requesting:');
    winston.debug(`hostname: ${requestOptions.hostname}, path: ${requestOptions.path}, via: ${requestOptions.method}, https: ${this.https}`);

    let connection: (http | https) = this.https ? https : http;
    connection.get(requestOptions, (response) => {
      let data: string = '';

      winston.debug(`JSON API responded with a status code of : ${response.statusCode}`);

      // Report back a 500 so it can be handled in the app
      if ((`${response.statusCode}`).match(/^5\d\d$/))
        fulfill({ statusCode: response.statusCode, json: null });

      response.on('data', (chunk) => {
        winston.debug(`Received data from: ${response.responseUrl}`);

        data += chunk;
      });

      response.on('end', () => {
        winston.debug(`Finished receiving data from: ${response.responseUrl}`);

        let responseObject: JsonResponseObject = {
          statusCode: response.statusCode,
          json: JSON.parse(data)
        };

        fulfill(responseObject);
      })
    }).on('error', (e) => {
      winston.error(e);
      reject();
    });
  }

  _getRequestOptions(path: string): RequestOptions {
    return {
      hostname: this.endpoint,
      path: path,
      method: RequestMethod.GET,
      headers: {
        accept: 'application/json'
      }
    };
  }
}
