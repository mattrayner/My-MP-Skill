'use strict';
// Import our testing framework and skill
import 'mocha';
import { expect } from 'chai';
import { RequestEnvelope, ResponseEnvelope, ui, Response } from 'ask-sdk-model';
import { handler as skill } from '../../src/index';

// Require our test fixture
const fixture = require('../fixtures/requests/help_intent.json');

// Cast our fixture into a RequestEnvelope object
const request: RequestEnvelope = <RequestEnvelope>fixture;

// Create a placehoder for our skill response
let skill_response: ResponseEnvelope;

describe('MyMP : HelpIntent', () => {
  beforeEach(() => {
    return new Promise((resolve, reject) => {
      skill(request, null, (error, responseEnvelope) => {
        skill_response = responseEnvelope;
        resolve();
      });
    });
  });

  afterEach(() => {
    skill_response = null;
  });

  it('Returns our help message as a response', () => {
    let outputSpeech = <ui.SsmlOutputSpeech>skill_response.response.outputSpeech;

    expect(outputSpeech.ssml).to.eq('<speak>My MP can tell you about your elected member of Parliament. Try saying, "Alexa, open My M. P.".</speak>');
  });

  it('Returns a simple card with suggested phrases', () => {
    let response: Response = <Response>skill_response.response;
    expect(response).to.have.property('card');
    expect(response.card.type).to.equal('Simple');
    expect((<ui.SimpleCard>response.card).content).to.eq("Try saying:\n\"Alexa, open My M. P.\"\n\"Alexa, ask My M. P. about themselves.\"\n\"Alexa, ask My M. P. for their name.\"");
    expect((<ui.SimpleCard>response.card).title).to.eq('Using this skill');
  });
});
