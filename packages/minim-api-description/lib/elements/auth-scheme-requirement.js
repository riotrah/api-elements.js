module.exports = (namespace) => {
  const ArrayElement = namespace.getElementClass('array');

  /**
   * @class AuthSchemeRequirement
   *
   * @param {Array} content
   * @param meta
   * @param attributes
   *
   * @extends ArrayElement
   */
  class AuthSchemeRequirement extends ArrayElement {
    constructor(...args) {
      super(...args);
      this.element = 'authSchemeRequirement';
    }
  }

  namespace.register('authSchemeRequirement', AuthSchemeRequirement);
};
