import {
  __, partial, flow, castArray, map, reject, toPairs, fromPairs, omit, has, includes,
  omitBy, isEmpty,
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
  exclude = [],
  parser = defaultParser,
  parserOptions = defaultParserOptions,
  resolveOptions = {},
} = {}) => {
  const resolvedFiles = resolveRelatives(files);
  const resolvedIgnoreUnusedExports = resolveRelatives(ignoreUnusedExports);

  return getEsImportsExports({
    files: resolvedFiles,
    exclude,
    recurse: false,
    parser,
    parserOptions,
    resolveOptions,
  }).then(({ imports, exports }) => {
    const unusedFiles = flow(
      reject(has(__, imports)),
      reject(includes(__, resolvedIgnoreUnusedExports))
    )(resolvedFiles);

    const unusedExports = flow(
      omit(resolvedIgnoreUnusedExports),
      toPairs,
      map(([filename, fileExports]) => [
        filename,
        reject(includes(__, imports[filename]), fileExports),
      ]),
      fromPairs,
      omitBy(isEmpty)
    )(exports);

    return {
      unusedFiles,
      unusedExports,
    };
  });
};
