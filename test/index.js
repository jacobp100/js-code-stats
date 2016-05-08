import test from 'ava';
import { size, values, endsWith } from 'lodash/fp';
import jsCodeStats from '../src';

test.serial('simple import export with no unused files or dependencies', t => {
  t.plan(3);

  return jsCodeStats([
    'simple-import-export/a.js',
    'simple-import-export/b.js',
  ], {
    ignoreUnusedExports: 'simple-import-export/a.js',
  }).then(({ unusedFiles, unusedExports, invalidImports }) => {
    t.is(size(unusedFiles), 0);
    t.is(size(unusedExports), 0);
    t.is(size(invalidImports), 0);
  });
});

test.serial('unused export', t => {
  t.plan(4);

  return jsCodeStats([
    'unused-export/a.js',
    'unused-export/b.js',
  ], {
    ignoreUnusedExports: 'unused-export/a.js',
  }).then(({ unusedFiles, unusedExports, invalidImports }) => {
    t.is(size(unusedFiles), 0);
    t.is(size(unusedExports), 1);
    t.deepEqual(values(unusedExports), [['b']]);
    t.is(size(invalidImports), 0);
  });
});

test.serial('unused file', t => {
  t.plan(5);

  return jsCodeStats([
    'unused-file/a.js',
    'unused-file/b.js',
    'unused-file/c.js',
  ], {
    ignoreUnusedExports: 'unused-file/a.js',
  }).then(({ unusedFiles, unusedExports, invalidImports }) => {
    t.is(size(unusedFiles), 1);
    t.true(endsWith('/c.js', unusedFiles[0]));
    t.is(size(unusedExports), 1);
    t.deepEqual(values(unusedExports), [['unusedCExport']]);
    t.is(size(invalidImports), 0);
  });
});

test.serial('namespace imports count as all exports being used', t => {
  t.plan(3);

  return jsCodeStats([
    'namespace-import/a.js',
    'namespace-import/b.js',
  ], {
    ignoreUnusedExports: 'namespace-import/a.js',
  }).then(({ unusedFiles, unusedExports, invalidImports }) => {
    t.is(size(unusedFiles), 0);
    t.is(size(unusedExports), 0);
    t.is(size(invalidImports), 0);
  });
});

test.serial('namespace exports does not export the string "*"', t => {
  t.plan(3);

  return jsCodeStats([
    'namespace-export/a.js',
    'namespace-export/b.js',
    'namespace-export/c.js',
  ], {
    ignoreUnusedExports: 'namespace-export/a.js',
  }).then(({ unusedFiles, unusedExports, invalidImports }) => {
    t.is(size(unusedFiles), 0);
    t.is(size(unusedExports), 0);
    t.is(size(invalidImports), 0);
  });
});

test.serial('invalid import', t => {
  t.plan(5);

  return jsCodeStats([
    'invalid-import/a.js',
    'invalid-import/b.js',
  ], {
    ignoreUnusedExports: 'invalid-import/a.js',
  }).then(({ unusedFiles, unusedExports, invalidImports }) => {
    t.is(size(unusedFiles), 0);
    t.is(size(unusedExports), 1);
    t.deepEqual(values(unusedExports), [['default']]);
    t.is(size(invalidImports), 1);
    t.deepEqual(values(invalidImports), [['b']]);
  });
});
