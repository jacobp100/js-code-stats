'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _fp = require('lodash/fp');

var _path = require('path');

var _getEsImportsExports = require('get-es-imports-exports');

var _getEsImportsExports2 = _interopRequireDefault(_getEsImportsExports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var resolveRelative = (0, _fp.partial)(_path.resolve, [process.cwd()]);
var resolveRelatives = (0, _fp.flow)(_fp.castArray, (0, _fp.map)(resolveRelative));

exports.default = function (files) {
  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref$ignoreUnusedExpo = _ref.ignoreUnusedExports;
  var ignoreUnusedExports = _ref$ignoreUnusedExpo === undefined ? [] : _ref$ignoreUnusedExpo;
  var _ref$parser = _ref.parser;
  var parser = _ref$parser === undefined ? _getEsImportsExports.defaultParser : _ref$parser;
  var _ref$parserOptions = _ref.parserOptions;
  var parserOptions = _ref$parserOptions === undefined ? _getEsImportsExports.defaultParserOptions : _ref$parserOptions;
  var _ref$resolveOptions = _ref.resolveOptions;
  var resolveOptions = _ref$resolveOptions === undefined ? {} : _ref$resolveOptions;

  var resolvedFiles = resolveRelatives(files);
  var resolvedIgnoreUnusedExports = resolveRelatives(ignoreUnusedExports);

  return (0, _getEsImportsExports2.default)({
    files: resolvedFiles,
    recurse: false,
    parser: parser,
    parserOptions: parserOptions,
    resolveOptions: resolveOptions
  }).then(function (_ref2) {
    var imports = _ref2.imports;
    var exports = _ref2.exports;

    var getReferencedNames = function getReferencedNames(location, filename, fileExports) {
      if ((0, _fp.includes)('*', location[filename])) return [];

      return (0, _fp.flow)((0, _fp.reject)((0, _fp.includes)(_fp.__, location[filename])), (0, _fp.reject)((0, _fp.equals)('*')))(fileExports);
    };

    var compareTo = (0, _fp.curry)(function (locationToCompareTo, currentLocation) {
      return (0, _fp.flow)(_fp.toPairs, (0, _fp.map)(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2);

        var filename = _ref4[0];
        var fileExports = _ref4[1];
        return [filename, getReferencedNames(locationToCompareTo, filename, fileExports)];
      }), _fp.fromPairs, (0, _fp.omitBy)(_fp.isEmpty))(currentLocation);
    });

    var unusedFiles = (0, _fp.flow)((0, _fp.reject)((0, _fp.has)(_fp.__, imports)), (0, _fp.reject)((0, _fp.includes)(_fp.__, resolvedIgnoreUnusedExports)))(resolvedFiles);

    var unusedExports = (0, _fp.flow)((0, _fp.omit)(resolvedIgnoreUnusedExports), compareTo(imports))(exports);

    var invalidImports = compareTo(exports, imports);

    return {
      unusedFiles: unusedFiles,
      unusedExports: unusedExports,
      invalidImports: invalidImports
    };
  });
};
