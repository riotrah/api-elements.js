/*
 * Parse result-specific refract elements.
 *
 * General structure:
 *
 * + ParseResult
 *   + Annotation
 */

const apiDescription = require('minim-api-description');
const Annotation = require('./elements/Annotation');
const ParseResult = require('./elements/ParseResult');
const SourceMap = require('./elements/SourceMap');

const namespace = (options) => {
  options.base
    .use(apiDescription)
    .register('parseResult', ParseResult)
    .register('annotation', Annotation)
    .register('sourceMap', SourceMap);
};

module.exports = {
  namespace,
  ParseResult,
  Annotation,
  SourceMap,
};
