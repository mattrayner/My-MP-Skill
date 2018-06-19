'use strict';

import { HandlerInput, RequestHandler, ResponseFactory } from "ask-sdk";
import { Response } from 'ask-sdk-model';

export const HelpIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput: HandlerInput) {
    const card_title = 'Using this skill';
    const card_body = "Try saying:\n\"Alexa, open My M. P.\"\n\"Alexa, ask My M. P. about themselves.\"\n\"Alexa, ask My M. P. for their name.\"";

    const speech = 'My MP can tell you about your elected member of Parliament. Try saying, "Alexa, open My M. P.".';

    let response: Response = ResponseFactory.init()
      .speak(speech)
      .withSimpleCard(card_title, card_body)
      .withShouldEndSession(true)
      .getResponse();

    return response;
  }
};
