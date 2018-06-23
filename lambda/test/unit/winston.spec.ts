'use strict';

import 'mocha';
import { expect } from 'chai';

let original_node_env;

describe('Winston', () => {
  beforeEach(() => {
    original_node_env = process.env.NODE_ENV;
    delete require.cache[ require.resolve('../../src/utils/winston') ]
  });

  afterEach(() => {
    process.env.NODE_ENV = original_node_env;
  });

  context('when in test mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test'
    });

    it('sets logger level to error', () => {
      expect(require('../../src/utils/winston').winston.level).to.eq('error');
    });
  });

  context('when not in test mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production'
    });

    it('sets logger level to debug', () => {
      expect(require('../../src/utils/winston').winston.level).to.eq('debug');
    });
  });
});