'use strict';
// Import our testing framework and skill
import 'mocha';
import { expect } from 'chai';
import { RequestEnvelope, ResponseEnvelope, ui, Response } from 'ask-sdk-model';
import { handler as skill } from '../../src/index';

// Require our test fixture
const fixture = require('../fixtures/requests/cancel_intent.json');

// Cast our fixture into a RequestEnvelope object
const request: RequestEnvelope = <RequestEnvelope>fixture;

// Create a placehoder for our skill response
let skill_response: ResponseEnvelope;

describe('MyMP : CancelIntent', () => {
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

  it('Returns the expected response structure', () => {
    expect(skill_response).to.have.property("version");
    expect(skill_response.version).to.be.equal("1.0");
    expect(skill_response).to.have.property("response");
  });
});
