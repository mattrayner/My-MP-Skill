'use strict';
// Import our testing framework and skill
import 'mocha';
import { expect } from 'chai';
import { RequestEnvelope, ResponseEnvelope, ui } from 'ask-sdk-model';
import { handler as skill } from '../../src/index';

// Require our test fixture
const fixture = require('../fixtures/requests/launch_request.json');

// Cast our fixture into a RequestEnvelope object
const request: RequestEnvelope = <RequestEnvelope>fixture;

// Create a placehoder for our skill response
let skill_response: ResponseEnvelope;

describe('MyMP : LaunchRequest', () => {
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

  it('Returns "Hello World" as a response', () => {
    let outputSpeech = <ui.SsmlOutputSpeech>skill_response.response.outputSpeech;

    expect(outputSpeech.ssml).to.eq('<speak>Hello World</speak>');
  });
});
