/*
 * API description-specific refract elements.
 * General structure:
 *
 * + Category - API, resource group
 *   + Category
 *   + Copy
 *   + Resource
 *     + Transition
 *       + Transaction
 *         + Request
 *           + Asset
 *           + Message body
 *           + Message body schema
 *         + Response
 *           + Asset
 *           + Message body
 *           + Message body schema
 *   + Transition
 *   + Data structure
 *     + Enumeration
 */

const Asset = require('./elements/Asset');
const AuthScheme = require('./elements/AuthScheme');
const Category = require('./elements/Category');
const Copy = require('./elements/Copy');
const DataStructure = require('./elements/DataStructure');
const Enum = require('./elements/Enum');
const Extension = require('./elements/Extension');
const HrefVariables = require('./elements/HrefVariables');
const HttpHeaders = require('./elements/HttpHeaders');
const HttpRequest = require('./elements/HttpRequest');
const HttpResponse = require('./elements/HttpResponse');
const Resource = require('./elements/Resource');
const Transition = require('./elements/Transition');
const HttpTransaction = require('./elements/HttpTransaction');

const defineValueOf = require('./define-value-of');

const namespace = (options) => {
  const namespace = options.base;

  namespace.register('asset', Asset);
  namespace.register('category', Category);
  namespace.register('copy', Copy);
  namespace.register('dataStructure', DataStructure);
  namespace.register('enum', Enum);
  namespace.register('extension', Extension);
  namespace.register('hrefVariables', HrefVariables);
  namespace.register('httpHeaders', HttpHeaders);
  namespace.register('httpRequest', HttpRequest);
  namespace.register('httpResponse', HttpResponse);
  namespace.register('httpTransaction', HttpTransaction);
  namespace.register('resource', Resource);
  namespace.register('transition', Transition);

  namespace.register('authScheme', AuthScheme);
  namespace.register('Basic Authentication Scheme', AuthScheme);
  namespace.register('Token Authentication Scheme', AuthScheme);
  namespace.register('OAuth2 Scheme', AuthScheme);

  defineValueOf(namespace);
};

module.exports = {
  namespace,
  Asset,
  AuthScheme,
  Category,
  Copy,
  DataStructure,
  Enum,
  Extension,
  HrefVariables,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
  HttpTransaction,
  Resource,
  Transition,
};
