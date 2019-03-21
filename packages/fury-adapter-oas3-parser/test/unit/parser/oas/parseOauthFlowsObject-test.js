const { Fury } = require('fury');
const { expect } = require('../../chai');
const parse = require('../../../../lib/parser/oas/parseOauthFlowsObject');
const Context = require('../../../../lib/context');

const { minim: namespace } = new Fury();

describe('Oauth Flows Object', () => {
  let context;
  beforeEach(() => {
    context = new Context(namespace);
  });

  it('provides warning when oauth flows is not an object', () => {
    const oauthFlows = new namespace.elements.String();

    const parseResult = parse(context, oauthFlows);

    expect(parseResult.length).to.equal(1);
    expect(parseResult).to.contain.warning("'Oauth Flows Object' is not an object");
  });

  describe('#implicit', () => {
    it('provides warning when no authorizationUrl', () => {
      const oauthFlows = new namespace.elements.Object({
        implicit: {
          scopes: {},
        },
      });

      const parseResult = parse(context, oauthFlows);

      expect(parseResult.length).to.equal(2);
      expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Array);
      expect(parseResult.get(0).length).to.equal(0);
      expect(parseResult).to.contain.warning("'Oauth Flows Object' 'implicit' is missing required property 'authorizationUrl'");
    });

    it('parses correctly', () => {
      const oauthFlows = new namespace.elements.Object({
        implicit: {
          authorizationUrl: '/authorization',
          scopes: {},
        },
      });

      const parseResult = parse(context, oauthFlows);

      expect(parseResult.length).to.equal(1);
      expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Array);
      expect(parseResult.get(0).length).to.equal(1);

      const flow = parseResult.get(0).get(0);

      expect(flow).to.be.instanceof(namespace.elements.Array);
      expect(flow.length).to.equal(3);

      expect(flow.get(0)).to.be.instanceof(namespace.elements.Member);
      expect(flow.get(0).key.toValue()).to.equal('grantType');
      expect(flow.get(0).value.toValue()).to.equal('implicit');

      expect(flow.get(1)).to.be.instanceof(namespace.elements.Member);
      expect(flow.get(1).key.toValue()).to.equal('scopes');
      expect(flow.get(1).value).to.be.instanceof(namespace.elements.Array);

      expect(flow.get(2)).to.be.instanceof(namespace.elements.Transition);
      expect(flow.get(2).href.toValue()).to.equal('/authorization');
    });
  });

  describe('#password', () => {
    it('provides warning when no tokenUrl', () => {
      const oauthFlows = new namespace.elements.Object({
        password: {
          scopes: {},
        },
      });

      const parseResult = parse(context, oauthFlows);

      expect(parseResult.length).to.equal(2);
      expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Array);
      expect(parseResult.get(0).length).to.equal(0);
      expect(parseResult).to.contain.warning("'Oauth Flows Object' 'password' is missing required property 'tokenUrl'");
    });

    it('parses correctly', () => {
      const oauthFlows = new namespace.elements.Object({
        password: {
          tokenUrl: '/token',
          scopes: {},
        },
      });

      const parseResult = parse(context, oauthFlows);

      expect(parseResult.length).to.equal(1);
      expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Array);
      expect(parseResult.get(0).length).to.equal(1);

      const flow = parseResult.get(0).get(0);

      expect(flow).to.be.instanceof(namespace.elements.Array);
      expect(flow.length).to.equal(3);

      expect(flow.get(0)).to.be.instanceof(namespace.elements.Member);
      expect(flow.get(0).key.toValue()).to.equal('grantType');
      expect(flow.get(0).value.toValue()).to.equal('resource owner password credentials');

      expect(flow.get(1)).to.be.instanceof(namespace.elements.Member);
      expect(flow.get(1).key.toValue()).to.equal('scopes');
      expect(flow.get(1).value).to.be.instanceof(namespace.elements.Array);

      expect(flow.get(2)).to.be.instanceof(namespace.elements.Transition);
      expect(flow.get(2).href.toValue()).to.equal('/token');
    });
  });

  describe('#clientCredentials', () => {
    it('provides warning when no tokenUrl', () => {
      const oauthFlows = new namespace.elements.Object({
        clientCredentials: {
          scopes: {},
        },
      });

      const parseResult = parse(context, oauthFlows);

      expect(parseResult.length).to.equal(2);
      expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Array);
      expect(parseResult.get(0).length).to.equal(0);
      expect(parseResult).to.contain.warning("'Oauth Flows Object' 'clientCredentials' is missing required property 'tokenUrl'");
    });

    it('parses correctly', () => {
      const oauthFlows = new namespace.elements.Object({
        clientCredentials: {
          tokenUrl: '/token',
          scopes: {},
        },
      });

      const parseResult = parse(context, oauthFlows);

      expect(parseResult.length).to.equal(1);
      expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Array);
      expect(parseResult.get(0).length).to.equal(1);

      const flow = parseResult.get(0).get(0);

      expect(flow).to.be.instanceof(namespace.elements.Array);
      expect(flow.length).to.equal(3);

      expect(flow.get(0)).to.be.instanceof(namespace.elements.Member);
      expect(flow.get(0).key.toValue()).to.equal('grantType');
      expect(flow.get(0).value.toValue()).to.equal('client credentials');

      expect(flow.get(1)).to.be.instanceof(namespace.elements.Member);
      expect(flow.get(1).key.toValue()).to.equal('scopes');
      expect(flow.get(1).value).to.be.instanceof(namespace.elements.Array);

      expect(flow.get(2)).to.be.instanceof(namespace.elements.Transition);
      expect(flow.get(2).href.toValue()).to.equal('/token');
    });
  });

  describe('#authorizationCode', () => {
    it('provides warning when no authorizationUrl', () => {
      const oauthFlows = new namespace.elements.Object({
        authorizationCode: {
          scopes: {},
        },
      });

      const parseResult = parse(context, oauthFlows);

      expect(parseResult.length).to.equal(2);
      expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Array);
      expect(parseResult.get(0).length).to.equal(0);
      expect(parseResult).to.contain.warning("'Oauth Flows Object' 'authorizationCode' is missing required property 'authorizationUrl'");
    });

    it('provides warning when no tokenUrl', () => {
      const oauthFlows = new namespace.elements.Object({
        authorizationCode: {
          authorizationUrl: '/authorization',
          scopes: {},
        },
      });

      const parseResult = parse(context, oauthFlows);

      expect(parseResult.length).to.equal(2);
      expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Array);
      expect(parseResult.get(0).length).to.equal(0);
      expect(parseResult).to.contain.warning("'Oauth Flows Object' 'authorizationCode' is missing required property 'tokenUrl'");
    });

    it('parses correctly', () => {
      const oauthFlows = new namespace.elements.Object({
        authorizationCode: {
          authorizationUrl: '/authorization',
          tokenUrl: '/token',
          scopes: {},
        },
      });

      const parseResult = parse(context, oauthFlows);

      expect(parseResult.length).to.equal(1);
      expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Array);
      expect(parseResult.get(0).length).to.equal(1);

      const flow = parseResult.get(0).get(0);

      expect(flow).to.be.instanceof(namespace.elements.Array);
      expect(flow.length).to.equal(4);

      expect(flow.get(0)).to.be.instanceof(namespace.elements.Member);
      expect(flow.get(0).key.toValue()).to.equal('grantType');
      expect(flow.get(0).value.toValue()).to.equal('authorization code');

      expect(flow.get(1)).to.be.instanceof(namespace.elements.Member);
      expect(flow.get(1).key.toValue()).to.equal('scopes');
      expect(flow.get(1).value).to.be.instanceof(namespace.elements.Array);

      expect(flow.get(2)).to.be.instanceof(namespace.elements.Transition);
      expect(flow.get(2).href.toValue()).to.equal('/authorization');

      expect(flow.get(3)).to.be.instanceof(namespace.elements.Transition);
      expect(flow.get(3).href.toValue()).to.equal('/token');
    });
  });

  it('parses multiple flows correctly', () => {
    const oauthFlows = new namespace.elements.Object({
      implicit: {
        authorizationUrl: '/authorization',
        scopes: {},
      },
      password: {
        tokenUrl: '/token',
        scopes: {},
      },
    });

    const parseResult = parse(context, oauthFlows);

    expect(parseResult.length).to.equal(1);
    expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Array);
    expect(parseResult.get(0).length).to.equal(2);

    const implicitFlow = parseResult.get(0).get(0);

    expect(implicitFlow).to.be.instanceof(namespace.elements.Array);
    expect(implicitFlow.length).to.equal(3);

    const passwordFlow = parseResult.get(0).get(1);

    expect(passwordFlow).to.be.instanceof(namespace.elements.Array);
    expect(passwordFlow.length).to.equal(3);
  });

  it('provides warning for invalid keys', () => {
    const oauthFlows = new namespace.elements.Object({
      invalid: '',
    });

    const parseResult = parse(context, oauthFlows);

    expect(parseResult.length).to.equal(2);
    expect(parseResult).to.contain.warning("'Oauth Flows Object' contains invalid key 'invalid'");
  });

  it('does not provide warning/errors for extensions', () => {
    const oauthFlows = new namespace.elements.Object({
      'x-extension': '',
    });

    const parseResult = parse(context, oauthFlows);

    expect(parseResult).to.not.contain.annotations;
  });
});
