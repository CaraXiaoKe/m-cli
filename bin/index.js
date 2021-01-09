#! /usr/bin/env node

'use strict';

const program = require('commander')
const runCmd = require("../lib/runCmd");

program
  .version("520-cli version：" + require('../package').version, "-v,--version")

program
  .command('dev')
  .action(() => {
    process.env.NODE_ENV = 'local';
    runCmd();
  });

program
  .command('build')
  .action(() => {
    runCmd();
  });

program.parse(process.argv)
