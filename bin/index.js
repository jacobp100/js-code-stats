#!/usr/bin/env node
/* eslint strict: [0], no-console: [0], no-extra-parens: [0] */

'use strict';
const _ = require('lodash/fp');
const chalk = require('chalk');
const yargs = require('yargs');
const jsCodeStats = require('..').default;

const args = yargs
  .option('ignore-unused-exports', {
    describe: 'Files to ignore unused exports from',
    alias: 'i',
    type: 'string',
    default: [],
  })
  .help()
  .argv;

jsCodeStats(args._, {
  ignoreUnusedExports: args.ignoreUnusedExports,
}).then(stats => {
  _.forEach(pair => console.error(chalk.red(
    `File ${pair[0]} attempted to import invalid imports: ${pair[1].join(', ')}`
  )), _.toPairs(stats.invalidImports));

  _.forEach(file => console.log(chalk.yellow(
    `File ${file} was never imported`
  )), stats.unusedFiles);

  _.forEach(pair => console.log(chalk.yellow(
    `File ${pair[0]} defined unused exports: ${pair[1].join(', ')}`
  )), _.toPairs(stats.unusedExports));
}).catch(e => {
  console.error('Critical error');
  console.error(e);
});
