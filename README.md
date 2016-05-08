# JS Code Stats

JS Code Stats search your codebase and notify you of,

* Invalid imports
* Unused files
* Unused exports

# CLI

```bash
js-code-stats ./src/**/*.js
```

```
File test/invalid-import/b.js attempted to import invalid imports: b
File test/invalid-import/a.js was never imported
File test/invalid-import/a.js defined unused exports: b
File test/invalid-import/b.js defined unused exports: default
```

You can specify to ignore unused exports exports from files using the `ignore-unused-exports` or `-i` option.

# JS API

```js
import jsCodeStats from 'js-code-stats';

jsCodeStats(files, {
  ignoreUnusedExports = [],
  parser = defaultParser,
  parserOptions = defaultParserOptions,
  resolveOptions = {},
}).then(({ unusedFiles, unusedExports, invalidImports }) => {
  ...
});
```

`ignoreUnusedExports` is the same as before.

Other options defined in [get-es-imports-exports](https://github.com/jacobp100/get-es-imports-exports)
