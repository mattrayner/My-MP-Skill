'use strict';

import { HandlerInput, RequestHandler, ResponseFactory, SkillBuilders } from 'ask-sdk';
import { RequestEnvelope, Response, ResponseEnvelope, Request } from 'ask-sdk-model';

export async function handler(event: RequestEnvelope, context: any, callback: any): Promise<ResponseEnvelope> {
  const LaunchRequestHandler: RequestHandler = {
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

  const factory = SkillBuilders
    .standard()
    .addRequestHandlers(
      LaunchRequestHandler
    );

  let skill = factory.create();

  try {
    const responseEnvelope: ResponseEnvelope = await skill.invoke(event, context);

    return callback(null, responseEnvelope);
  } catch (error) {
    console.log(error);

    return callback(error);
  }
}