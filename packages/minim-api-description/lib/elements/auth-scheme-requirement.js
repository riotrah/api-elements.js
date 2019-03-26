module.exports = (namespace) => {
  const ArrayElement = namespace.getElementClass('array');

  /**
   * @class AuthSchemeRequirment
   *
   * @param {Array} content
   * @param meta
   * @param attributes
   *
   * @extends ArrayElement
   */
  class AuthSchemeRequirment extends ArrayElement {
    constructor(...args) {
      super(...args);
      this.element = 'authSchemeRequirment';
    }
  }

  namespace.register('authSchemeRequirment', AuthSchemeRequirment);
};
