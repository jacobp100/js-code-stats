import {
  __, partial, flow, castArray, map, reject, toPairs, fromPairs, omit, has, includes,
  omitBy, isEmpty, equals, curry,
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
    const getReferencedNames = (location, filename, fileExports) => {
      if (includes('*', location[filename])) return [];

      return flow(
        reject(includes(__, location[filename])),
        reject(equals('*'))
      )(fileExports);
    };

    const compareTo = curry((locationToCompareTo, currentLocation) => flow(
      toPairs,
      map(([filename, fileExports]) => [
        filename,
        getReferencedNames(locationToCompareTo, filename, fileExports),
      ]),
      fromPairs,
      omitBy(isEmpty)
    )(currentLocation));

    const unusedFiles = flow(
      reject(has(__, imports)),
      reject(includes(__, resolvedIgnoreUnusedExports))
    )(resolvedFiles);

    const unusedExports = flow(
      omit(resolvedIgnoreUnusedExports),
      compareTo(imports)
    )(exports);

    const invalidImports = compareTo(exports, imports);

    return {
      unusedFiles,
      unusedExports,
      invalidImports,
    };
  });
};
