'use strict';

import { HandlerInput } from "ask-sdk";
import { IntentRequest } from "ask-sdk-model";

export const CloseSkillHander = {
  canHandle(handlerInput: HandlerInput) {
    const session_ended_request = (handlerInput.requestEnvelope.request.type === 'SessionEndedRequest');

    const intent_request = (handlerInput.requestEnvelope.request.type === 'IntentRequest');
    const stop_intent = (intent_request &&  (<IntentRequest>handlerInput.requestEnvelope.request).intent.name === 'AMAZON.StopIntent');
    const cancel_intent = (intent_request &&  (<IntentRequest>handlerInput.requestEnvelope.request).intent.name === 'AMAZON.CancelIntent')

    return (session_ended_request || stop_intent || cancel_intent);
  },
  handle(handlerInput: HandlerInput) {
    return handlerInput.responseBuilder.getResponse();
  },
};