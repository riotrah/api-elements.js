const { Element, ArrayElement } = require('minim');

/**
 * @class SourceMap
 *
 * @param {Array} content
 * @param meta
 * @param attributes
 *
 * @extends ArrayElement
 */
class SourceMap extends ArrayElement {
  constructor(...args) {
    super(...args);
    this.element = 'sourceMap';
  }

  // Override toValue because until Refract 1.0
  // sourceMap is special element that contains array of array
  // TODO Remove in next minor release
  toValue() {
    return this.content.map(value => value.map(element => element.toValue()));
  }
}

/**
 * @name sourceMapValue
 * @type Array
 * @memberof Element.prototype
 */
if (!Object.getOwnPropertyNames(Element.prototype).includes('sourceMapValue')) {
  Object.defineProperty(Element.prototype, 'sourceMapValue', {
    get() {
      const sourceMap = this.attributes.get('sourceMap');

      if (sourceMap) {
        return sourceMap.first.toValue();
      }

      return undefined;
    },
  });
}

module.exports = SourceMap;
