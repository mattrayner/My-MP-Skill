'use strict';

import { HandlerInput, RequestHandler, ResponseFactory } from "ask-sdk";
import { Response, Request } from 'ask-sdk-model';

export const LaunchRequestHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput: HandlerInput) {
    const request: Request = handlerInput.requestEnvelope.request;

    let response: Response = ResponseFactory.init()
      .speak('Hello World')
      .withShouldEndSession(true)
      .getResponse();

    return response;
  }
};

//
// import { HandlerInput, RequestHandler } from "ask-sdk";
//
// import { FindMyMPHandler } from './find_my_mp_handler';
//
// export const LaunchRequestHandler: RequestHandler = {
//   canHandle(handlerInput: HandlerInput) {
//     return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
//   },
//   handle(handlerInput: HandlerInput) {
//     return FindMyMPHandler.handle(handlerInput);
//   }
// };
