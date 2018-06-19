'use strict';

// Import the Alexa Skill Kit modules we require
import { SkillBuilders } from 'ask-sdk';
import { RequestEnvelope, ResponseEnvelope } from 'ask-sdk-model';

// Import our handlers
import { LaunchRequestHandler } from './handlers/launch_request';
import { HelpIntentHandler } from './handlers/help_intent';
import { CloseSkillHander } from './handlers/close_skill';

export async function handler(event: RequestEnvelope, context: any, callback: any): Promise<ResponseEnvelope> {
  const factory = SkillBuilders
    .standard()
    .addRequestHandlers(
      LaunchRequestHandler,
      HelpIntentHandler,
      CloseSkillHander
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