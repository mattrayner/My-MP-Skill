'use strict';

import 'mocha';
import { expect } from 'chai';
import { JsonClient } from '../../src/utils/json_client';

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
    it('gets some JSON');

    it('follows redirects');

    it('populates the statusCode response correctly');

    context('https set to true', () => {
      it('requests https');
    });

    context('https set to false', () => {
      it('requests http');
    });
  })
});
