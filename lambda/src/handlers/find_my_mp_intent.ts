'use strict';

import { HandlerInput, RequestHandler, ResponseFactory } from "ask-sdk";
import { Response, Request } from 'ask-sdk-model';
import { winston } from '../utils/winston';

const PERMISSIONS: string[] = [ 'read::alexa:device:all:address:country_and_postal_code' ];

export const FindMyMPIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'FindMyMPIntent';
  },
  async handle(handlerInput: HandlerInput) {
    const { requestEnvelope, serviceClientFactory, responseBuilder } = handlerInput;
    let response = responseBuilder.withShouldEndSession(true);

    const consentToken = requestEnvelope.context.System.user.permissions
      && requestEnvelope.context.System.user.permissions.consentToken;

    if (!consentToken)
      return response
        .speak('Please enable Location permissions in the Amazon Alexa app.')
        .withAskForPermissionsConsentCard(PERMISSIONS)
        .getResponse();

    try {
      const { deviceId } = requestEnvelope.context.System.device;
      const deviceAddressServiceClient = serviceClientFactory.getDeviceAddressServiceClient();
      const address = await deviceAddressServiceClient.getCountryAndPostalCode(deviceId);

      if (address.countryCode != 'GB' || address.postalCode == null) {
        return response
          .speak('I was unable to get the address for this device. Check that you\'ve set a UK address for this device within your Alexa app.')
          .getResponse();
      }

      winston.info('Address successfully retrieved, now requesting to Parliament.');
    } catch (error) {
      winston.info(error);

      if (error.name === 'ServiceError')
        return response
          .speak('There was a problem getting your postcode from Amazon. Please try again later.')
          .getResponse();

      throw error;
    }
  }
};
