'use strict';

import 'mocha';
import { expect } from 'chai';
import { handler } from '../src/index';

describe('index.handler', () => {
  it('Returns "Hello Typescript"', () => {
    expect(handler()).to.eq('Hello TypeScript');
  })
});
