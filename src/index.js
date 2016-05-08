import {
  __, partial, flow, castArray, map, reject, toPairs, fromPairs, omit, has, includes,
  omitBy, isEmpty, equals, filter,
} from 'lodash/fp';
import { resolve } from 'path';
import getEsImportsExports, { defaultParser, defaultParserOptions } from 'get-es-imports-exports';

const resolveRelative = partial(resolve, [process.cwd()]);
const resolveRelatives = flow(
  castArray,
  map(resolveRelative)
);

export default (files, {
  ignoreUnusedExports = [],
  parser = defaultParser,
  parserOptions = defaultParserOptions,
  resolveOptions = {},
} = {}) => {
  const resolvedFiles = resolveRelatives(files);
  const resolvedIgnoreUnusedExports = resolveRelatives(ignoreUnusedExports);

  return getEsImportsExports({
    files: resolvedFiles,
    recurse: false,
    parser,
    parserOptions,
    resolveOptions,
  }).then(({ imports, exports }) => {
    const unusedFiles = flow(
      reject(has(__, imports)),
      reject(includes(__, resolvedIgnoreUnusedExports))
    )(resolvedFiles);

    const getUnusedExports = (filename, fileExports) => {
      if (includes('*', imports[filename])) return [];

      return flow(
        reject(includes(__, imports[filename])),
        reject(equals('*'))
      )(fileExports);
    };

    const unusedExports = flow(
      omit(resolvedIgnoreUnusedExports),
      toPairs,
      map(([filename, fileExports]) => [
        filename,
        getUnusedExports(filename, fileExports),
      ]),
      fromPairs,
      omitBy(isEmpty)
    )(exports);

    const getInvalidImports = (filename, fileImports) => {
      if (includes('*', exports[filename])) return [];

      return flow(
        reject(includes(__, exports[filename])),
        reject('*')
      )(fileImports);
    };

    const invalidImports = flow(
      toPairs,
      filter(([filename]) => has(filename, exports)),
      map(([filename, fileImports]) => [
        filename,
        getInvalidImports(filename, fileImports),
      ]),
      fromPairs,
      omitBy(isEmpty)
    )(imports);

    return {
      unusedFiles,
      unusedExports,
      invalidImports,
    };
  });
};
