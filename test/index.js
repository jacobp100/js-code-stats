import test from 'ava';
import { size, values, endsWith } from 'lodash/fp';
import jsCodeStats from '../src';

test.serial('simple import export with no unused files or dependencies', t => {
  t.plan(2);

  return jsCodeStats([
    'simple-import-export/a.js',
    'simple-import-export/b.js',
  ], {
    ignoreUnusedExports: 'simple-import-export/a.js',
  }).then(({ unusedFiles, unusedExports }) => {
    t.is(size(unusedFiles), 0);
    t.is(size(unusedExports), 0);
  });
});

test.serial('unused export', t => {
  t.plan(3);

  return jsCodeStats([
    'unused-export/a.js',
    'unused-export/b.js',
  ], {
    ignoreUnusedExports: 'unused-export/a.js',
  }).then(({ unusedFiles, unusedExports }) => {
    t.is(size(unusedFiles), 0);
    t.is(size(unusedExports), 1);
    t.deepEqual(values(unusedExports), [['b']]);
  });
});

test.serial('unused file', t => {
  t.plan(4);

  return jsCodeStats([
    'unused-file/a.js',
    'unused-file/b.js',
    'unused-file/c.js',
  ], {
    ignoreUnusedExports: 'unused-file/a.js',
  }).then(({ unusedFiles, unusedExports }) => {
    t.is(size(unusedFiles), 1);
    t.true(endsWith('/c.js', unusedFiles[0]));
    t.is(size(unusedExports), 1);
    t.deepEqual(values(unusedExports), [['unusedCExport']]);
  });
});
