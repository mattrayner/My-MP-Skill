'use strict';

import * as Winston from 'winston'

let level: string = 'debug';
if (process.env.NODE_ENV == 'test')
  level = 'error';

export const winston: Winston.Logger = Winston.createLogger({
  level: level,
  format: Winston.format.simple(),
  transports: [
    new Winston.transports.Console()
  ]
});
