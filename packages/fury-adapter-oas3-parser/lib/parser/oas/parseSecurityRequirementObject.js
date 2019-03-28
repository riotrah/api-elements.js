const R = require('ramda');
const { isString } = require('../../predicates');
const { createWarning } = require('../annotations');
const pipeParseResult = require('../../pipeParseResult');
const parseObject = require('../parseObject');
const parseArray = require('../parseArray');

const name = 'Security Requirement Object';

/**
 * Parse Security Requirement Object
 *
 * @param namespace {Namespace}
 * @param element {Element}
 * @returns ParseResult
 *
 * @see https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#securityRequirementObject
 * @private
 */
function parseSecurityRequirementObject(context, object) {
  const { namespace } = context;

  const parseScopes = (member) => {
    const key = member.key.toValue();

    const createScopeNotStringWarning = createWarning(namespace,
      `'${name}' '${key}' array value is not a string`);

    const parseScope = pipeParseResult(namespace,
      R.unless(isString, createScopeNotStringWarning),
      value => value);

    return parseArray(context, `${name}' '${key}`, parseScope)(member.value);
  };

  const parseMember = R.cond([
    [R.T, parseScopes],
  ]);

  const parseSecurityRequirement = pipeParseResult(namespace,
    parseObject(context, name, parseMember),
    e => new namespace.elements.AuthSchemeRequirement(e.content),
    R.map((member) => {
      let e;
      const scopes = member.value.map(scope => scope.toValue());

      if (scopes.length) {
        e = new namespace.elements.Object({ scopes });
      } else {
        e = new namespace.elements.Object({});
      }

      e.element = member.key.toValue();

      return e;
    }));

  return parseSecurityRequirement(object);
}

module.exports = R.curry(parseSecurityRequirementObject);
