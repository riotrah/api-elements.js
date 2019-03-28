module.exports = (namespace) => {
  const ArrayElement = namespace.getElementClass('array');

  /**
   * @class HttpTransaction
   *
   * @param {Array} content
   * @param meta
   * @param attributes
   *
   * @extends ArrayElement
   */
  class HttpTransaction extends ArrayElement {
    constructor(...args) {
      super(...args);
      this.element = 'httpTransaction';
    }

    /**
     * @name request
     * @type HttpRequest
     * @memberof HttpTransaction.prototype
     */
    get request() {
      return this.children.filter(item => item.element === 'httpRequest').first;
    }

    /**
     * @name response
     * @type HttpResponse
     * @memberof HttpTransaction.prototype
     */
    get response() {
      return this.children.filter(item => item.element === 'httpResponse').first;
    }

    /**
     * @name authSchemeRequirements
     * @type ArrayElement
     * @memberof HttpTransaction.prototype
     */
    get authSchemeRequirements() {
      return this.attributes.get('authSchemeRequirements');
    }
  }

  namespace.register('httpTransaction', HttpTransaction);
};
