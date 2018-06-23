'use strict';
// Import our testing framework and skill
import 'mocha';
import { expect } from 'chai';
import { RequestEnvelope, ResponseEnvelope, ui, Response } from 'ask-sdk-model';
import { handler as skill } from '../../src/index';
import * as nock from 'nock';

// Require our test fixture
const no_permission_fixture = require('../fixtures/requests/find_my_mp_intent/no_permission.json');
const with_permission_fixture = require('../fixtures/requests/find_my_mp_intent/with_permission.json');

// Cast our fixture into a RequestEnvelope object
const no_permission_request: RequestEnvelope = <RequestEnvelope>no_permission_fixture;
const with_permission_request: RequestEnvelope = <RequestEnvelope>with_permission_fixture;

// Create a placehoder for our skill response
let skill_response: ResponseEnvelope;

describe('MyMP : FindMyMPIntent', () => {
  afterEach(() => {
    skill_response = null;
  });

  context('with permission', () => {
    context('Amazon address API error', () => {
      beforeEach(() => {
        nock('https://api.amazonalexa.com/v1/devices/string-identifying-the-device/settings/address/countryAndPostalCode')
          .get('').reply(403, '');

        return new Promise((resolve, reject) => {
          skill(with_permission_request, null, (error, responseEnvelope) => {
            skill_response = responseEnvelope;
            resolve();
          });
        });
      });

      it('tells the user there has been an error', () => {
        let outputSpeech = <ui.SsmlOutputSpeech>skill_response.response.outputSpeech;

        expect(outputSpeech.ssml).to.eq('<speak>There was a problem getting your postcode from Amazon. Please try again later.</speak>');
      });
    });

    context('Amazon address API success', () => {
      context('Complete UK address', () => {
        it('sends postcode to Parliament');

        // beforeEach(() => {
        //   nock('https://api.amazonalexa.com/v1/devices/string-identifying-the-device/settings/address/countryAndPostalCode')
        //     .get('').reply(200, '{"countryCode" : "GB", "postalCode" : "SW1A 0AA"}', {
        //     'X-Amzn-RequestId': 'xxxx-xxx-xxx',
        //     'content-type': 'application/json'
        //   });
        // });
        //
        // context('Parliament API error', () => {
        //   beforeEach(() => {
        //     nock('https://beta.parliament.uk/postcodes/SW1A%200AA')
        //       .get('').reply(404, 'Not Found', { 'Alexa-Parliament': 'true', 'Accept': 'application/json' });
        //
        //     return new Promise((resolve, reject) => {
        //       skill(with_permission_request, null, (error, responseEnvelope) => {
        //         skill_response = responseEnvelope;
        //         resolve();
        //       });
        //     });
        //   });
        // });
      });

      context('Incomplete address', () => {
        beforeEach(() => {
          nock('https://api.amazonalexa.com/v1/devices/string-identifying-the-device/settings/address/countryAndPostalCode')
            .get('').reply(200, '{"countryCode" : "GB"}', {
            'X-Amzn-RequestId': 'xxxx-xxx-xxx',
            'content-type': 'application/json'
          });

          return new Promise((resolve, reject) => {
            skill(with_permission_request, null, (error, responseEnvelope) => {
              skill_response = responseEnvelope;
              resolve();
            });
          });
        });

        it('tells the user there was an address issue', () => {
          let outputSpeech = <ui.SsmlOutputSpeech>skill_response.response.outputSpeech;

          expect(outputSpeech.ssml).to.eq('<speak>I was unable to get the address for this device. Check that you\'ve set a UK address for this device within your Alexa app.</speak>');
        });
      });

      context('Non GB address', () => {
        beforeEach(() => {
          nock('https://api.amazonalexa.com/v1/devices/string-identifying-the-device/settings/address/countryAndPostalCode')
            .get('').reply(200, '{"countryCode" : "US", "postalCode": "99524"}', {
            'X-Amzn-RequestId': 'xxxx-xxx-xxx',
            'content-type': 'application/json'
          });

          return new Promise((resolve, reject) => {
            skill(with_permission_request, null, (error, responseEnvelope) => {
              skill_response = responseEnvelope;
              resolve();
            });
          });
        });

        it('tells the user there was an address issue', () => {
          let outputSpeech = <ui.SsmlOutputSpeech>skill_response.response.outputSpeech;

          expect(outputSpeech.ssml).to.eq('<speak>I was unable to get the address for this device. Check that you\'ve set a UK address for this device within your Alexa app.</speak>');
        });
      });
    })
  });

  context('without permission', () => {
    beforeEach(() => {
      return new Promise((resolve, reject) => {
        skill(no_permission_request, null, (error, responseEnvelope) => {
          skill_response = responseEnvelope;
          resolve();
        });
      });
    });

    it('asks for permission from the user', () => {
      let outputSpeech = <ui.SsmlOutputSpeech>skill_response.response.outputSpeech;

      expect(outputSpeech.ssml).to.eq('<speak>Please enable Location permissions in the Amazon Alexa app.</speak>');
    });

    it('returns a permissions card', () => {
      let r: Response = <Response>skill_response.response;
      expect(r).to.have.property('card');
      expect(r.card.type).to.equal('AskForPermissionsConsent', 'Has a permission card');
      expect((<ui.AskForPermissionsConsentCard>r.card).permissions.length).to.equal(1, 'Has exactly one permission');
      expect((<ui.AskForPermissionsConsentCard>r.card).permissions[ 0 ]).to.equal(
        'read::alexa:device:all:address:country_and_postal_code',
        'Has the expected card permission'
      );
    });
  });
});
