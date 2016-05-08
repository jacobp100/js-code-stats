#! /usr/local/bin/node
/* eslint strict: [0], no-console: [0], no-extra-parens: [0] */

'use strict';
const _ = require('lodash/fp');
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
  _.forEach(file => console.log(`File ${file} was never imported`), stats.unusedFiles);

  _.forEach(pair => (
    console.log(`File ${pair[0]} defined unused exports: ${pair[1].join(', ')}`)
  ), _.toPairs(stats.unusedExports));
});
