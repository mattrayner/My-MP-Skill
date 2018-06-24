'use strict';

import 'mocha';
import { expect } from 'chai';
import { JsonClient, JsonResponseObject } from '../../src/utils/json_client';
import * as nock from 'nock';

describe('JsonClient', () => {
  describe('constructor', () => {
    it('sets an endpoint', () => {
      expect(new JsonClient('example.com').endpoint).to.eq('example.com');
    });

    it('desfaults to https', () => {
      expect(new JsonClient('example.com').https).to.eq(true);
    });

    it('can be overridden to http', () => {
      expect(new JsonClient('example.com', false).https).to.eq(false);
    });
  });

  describe('getJson', () => {
    it('gets some JSON', async () => {
      nock('https://example.com')
        .get('/test').reply(200, '{ "test": true }');

      let client = new JsonClient('example.com');
      const result: JsonResponseObject = await client.getJson('/test');

      expect(result.json.test).to.eq(true);
    });

    it('follows redirects', async () => {
      nock('https://example.com')
        .get('/test').reply(302, '{ "redirect": false, "test": true }', { "Location": "https://example.com/redirected" });

      nock('https://example.com')
        .get('/redirected').reply(200, '{ "redirect": true }');

      let client = new JsonClient('example.com');
      const result: JsonResponseObject = await client.getJson('/test');
      expect(result.json.redirect).to.eq(true);
    });

    it('populates the statusCode correctly', async () => {
      nock('https://example.com')
        .get('/test').reply(404, '{}');

      let client = new JsonClient('example.com');
      let result: JsonResponseObject = await client.getJson('/test');
      expect(result.statusCode).to.eq(404);

      nock('https://example.com')
        .get('/test2').reply(500, '{}');

      client = new JsonClient('example.com');
      result = await client.getJson('/test2');
      expect(result.statusCode).to.eq(500);
    });

    context('https set to true', () => {
      let client = null;

      beforeEach(() => {
        nock('https://example.com')
          .get('/test').reply(200, '{"test": true}');

        client = new JsonClient('example.com', true);
      });

      afterEach(() => {
        client = null;
      });

      it('requests https', async () => {
        let client = new JsonClient('example.com');
        const result: JsonResponseObject = await client.getJson('/test');
        expect(result.json.test).to.eq(true)
      });
    });

    context('https set to false', () => {
      let client = null;

      beforeEach(() => {
        nock('http://example.com')
          .get('/test').reply(200, '{"test": true}');

        client = new JsonClient('example.com', false);
      });

      afterEach(() => {
        client = null;
      });

      it('requests http', async () => {
        const result: JsonResponseObject = await client.getJson('/test');
        expect(result.json.test).to.eq(true)
      });
    });
  });
});
