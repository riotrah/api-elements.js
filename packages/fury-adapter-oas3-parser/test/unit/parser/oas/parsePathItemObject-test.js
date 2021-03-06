const { Fury } = require('fury');
const { expect } = require('../../chai');

const parse = require('../../../../lib/parser/oas/parsePathItemObject');
const Context = require('../../../../lib/context');

const { minim: namespace } = new Fury();

describe('Path Item Object', () => {
  let context;
  beforeEach(() => {
    context = new Context(namespace);
  });

  it('parses a path into a resource', () => {
    const path = new namespace.elements.Member('/', {});
    const parseResult = parse(context, path);

    expect(parseResult.length).to.equal(1);
    expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Resource);
    expect(parseResult.get(0).href.toValue()).to.equal('/');
  });

  it('parses a path methods into a resource and transactions', () => {
    const path = new namespace.elements.Member('/', {
      get: {
        responses: {
          200: {
            description: 'dummy',
          },
        },
      },
    });
    const parseResult = parse(context, path);

    expect(parseResult.length).to.equal(1);

    const resource = parseResult.get(0);
    expect(resource).to.be.instanceof(namespace.elements.Resource);
    expect(resource.href.toValue()).to.equal('/');
    expect(resource.length).to.equal(1);

    const transition = resource.get(0);
    expect(transition).to.be.instanceof(namespace.elements.Transition);
    expect(transition.method.toValue()).to.equal('GET');
  });

  it('provides a warning when the path item object is non-object', () => {
    const path = new namespace.elements.Member('/', null);
    const parseResult = parse(context, path);

    expect(parseResult.length).to.equal(1);
    expect(parseResult).to.contain.warning("'Path Item Object' is not an object");
  });

  describe('warnings for keys', () => {
    it('warns for $ref', () => {
      const path = new namespace.elements.Member('/', {
        $ref: '',
      });

      const parseResult = parse(context, path);

      expect(parseResult.length).to.equal(2);
      expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Resource);
      expect(parseResult.get(0).href.toValue()).to.equal('/');

      expect(parseResult).to.contain.warning("'Path Item Object' contains unsupported key '$ref'");
    });

    it('warns for a servers', () => {
      const path = new namespace.elements.Member('/', {
        servers: '',
      });

      const parseResult = parse(context, path);

      expect(parseResult.length).to.equal(2);
      expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Resource);
      expect(parseResult.get(0).href.toValue()).to.equal('/');

      expect(parseResult).to.contain.warning("'Path Item Object' contains unsupported key 'servers'");
    });

    it('does not provide warning for Info Object extensions', () => {
      const path = new namespace.elements.Member('/', {
        'x-extension': '',
      });

      const parseResult = parse(context, path);

      expect(parseResult.length).to.equal(1);
      expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Resource);
    });

    it('provides warning for invalid keys', () => {
      const path = new namespace.elements.Member('/', {
        invalid: '',
      });

      const parseResult = parse(context, path);

      expect(parseResult.length).to.equal(2);
      expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Resource);
      expect(parseResult.get(0).href.toValue()).to.equal('/');

      expect(parseResult).to.contain.warning("'Path Item Object' contains invalid key 'invalid'");
    });
  });

  describe('#summary', () => {
    it('warns when summary is not a string', () => {
      const path = new namespace.elements.Member('/', {
        summary: 1,
      });

      const parseResult = parse(context, path);

      expect(parseResult.length).to.equal(2);
      expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Resource);
      expect(parseResult.get(0).href.toValue()).to.equal('/');

      expect(parseResult).to.contain.warning("'Path Item Object' 'summary' is not a string");
    });

    it('exposes summary as the title of the resource', () => {
      const path = new namespace.elements.Member('/', {
        summary: 'Root',
      });

      const parseResult = parse(context, path);

      expect(parseResult.length).to.equal(1);
      expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Resource);
      expect(parseResult.get(0).title.toValue()).to.equal('Root');
    });
  });

  describe('#description', () => {
    it('exposes description as a copy element in the resource', () => {
      const path = new namespace.elements.Member('/', {
        description: 'This is a resource',
      });

      const parseResult = parse(context, path);

      expect(parseResult.length).to.equal(1);
      expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Resource);
      expect(parseResult.get(0).copy.toValue()).to.deep.equal(['This is a resource']);
    });

    it('warns when description is not a string', () => {
      const path = new namespace.elements.Member('/', {
        description: 1,
      });

      const parseResult = parse(context, path);

      expect(parseResult.length).to.equal(2);
      expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Resource);
      expect(parseResult.get(0).length).to.equal(0);

      expect(parseResult).to.contain.warning("'Path Item Object' 'description' is not a string");
    });
  });

  describe('#parameters', () => {
    it('warns when parameters is not an array', () => {
      const path = new namespace.elements.Member('/', {
        parameters: {},
      });

      const parseResult = parse(context, path);

      expect(parseResult.length).to.equal(2);
      expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Resource);
      expect(parseResult.get(0).href.toValue()).to.equal('/');

      expect(parseResult).to.contain.warning("'Path Item Object' 'parameters' is not an array");
    });

    describe('path parameters', () => {
      it('exposes parameter in hrefVariables', () => {
        const path = new namespace.elements.Member('/{resource}', {
          parameters: [
            {
              name: 'resource',
              in: 'path',
              required: true,
            },
          ],
        });

        const parseResult = parse(context, path);

        expect(parseResult.length).to.equal(1);
        expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Resource);

        const resource = parseResult.get(0);
        expect(resource.hrefVariables).to.be.instanceof(namespace.elements.HrefVariables);
        expect(resource.hrefVariables.length).to.equal(1);
        expect(resource.hrefVariables.getMember('resource')).to.be.instanceof(namespace.elements.Member);
      });

      it('errors when parameter is not found in path', () => {
        const path = new namespace.elements.Member('/', {
          parameters: [
            {
              name: 'resource',
              in: 'path',
              required: true,
            },
          ],
        });

        const parseResult = parse(context, path);

        expect(parseResult.length).to.equal(1);
        expect(parseResult).to.contain.error("Path '/' is missing path variable 'resource'. Add '{resource}' to the path");
      });
    });

    describe('query parameters', () => {
      it('exposes query parameter in href', () => {
        const path = new namespace.elements.Member('/', {
          parameters: [
            {
              name: 'categories',
              in: 'query',
            },
          ],
        });

        const parseResult = parse(context, path);

        expect(parseResult.length).to.equal(1);
        expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Resource);

        const resource = parseResult.get(0);
        expect(resource.href.toValue()).to.equal('/{?categories}');
      });

      it('exposes multiple query parameter in href', () => {
        const path = new namespace.elements.Member('/', {
          parameters: [
            {
              name: 'categories',
              in: 'query',
            },
            {
              name: 'tags',
              in: 'query',
            },
          ],
        });

        const parseResult = parse(context, path);

        expect(parseResult.length).to.equal(1);
        expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Resource);

        const resource = parseResult.get(0);
        expect(resource.href.toValue()).to.equal('/{?categories,tags}');
      });

      it('exposes query parameter in hrefVariables', () => {
        const path = new namespace.elements.Member('/', {
          parameters: [
            {
              name: 'resource',
              in: 'query',
            },
          ],
        });

        const parseResult = parse(context, path);

        expect(parseResult.length).to.equal(1);
        expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Resource);

        const resource = parseResult.get(0);
        expect(resource.hrefVariables).to.be.instanceof(namespace.elements.HrefVariables);
        expect(resource.hrefVariables.length).to.equal(1);
        expect(resource.hrefVariables.getMember('resource')).to.be.instanceof(namespace.elements.Member);
      });
    });

    describe('header parameters', () => {
      it('exposes header parameter in operation requests', () => {
        const path = new namespace.elements.Member('/', {
          parameters: [
            {
              name: 'Accept',
              in: 'header',
              example: 'application/json',
            },
          ],
          get: {
            responses: {
              200: {
                description: 'dummy',
              },
            },
          },
        });

        const parseResult = parse(context, path);

        expect(parseResult.length).to.equal(1);
        expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Resource);

        const resource = parseResult.get(0);

        const transition = resource.transitions.get(0);
        const transaction = transition.transactions.get(0);
        const { request } = transaction;

        expect(request.headers).to.be.instanceof(namespace.elements.HttpHeaders);
        expect(request.headers.toValue()).to.deep.equal([
          {
            key: 'Accept',
            value: 'application/json',
          },
        ]);
      });

      it('prefers headers defined by operation', () => {
        const path = new namespace.elements.Member('/', {
          parameters: [
            {
              name: 'Accept',
              in: 'header',
              example: 'application/json',
            },
          ],
          get: {
            parameters: [
              {
                name: 'Accept',
                in: 'header',
                example: 'application/problem+json',
              },
            ],
            responses: {
              404: {
                description: 'dummy',
              },
            },
          },
        });

        const parseResult = parse(context, path);

        expect(parseResult.length).to.equal(1);
        expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Resource);

        const resource = parseResult.get(0);

        const transition = resource.transitions.get(0);
        const transaction = transition.transactions.get(0);
        const { request } = transaction;

        expect(request.headers).to.be.instanceof(namespace.elements.HttpHeaders);
        expect(request.headers.toValue()).to.deep.equal([
          {
            key: 'Accept',
            value: 'application/problem+json',
          },
        ]);
      });

      it('merges headers with operation headers', () => {
        const path = new namespace.elements.Member('/', {
          parameters: [
            {
              name: 'Accept',
              in: 'header',
              example: 'application/json',
            },
          ],
          get: {
            parameters: [
              {
                name: 'Link',
                in: 'header',
                example: '<https://api.github.com/user/repos?page=3&per_page=100>; rel="next"',
              },
            ],
            responses: {
              404: {
                description: 'dummy',
              },
            },
          },
        });

        const parseResult = parse(context, path);

        expect(parseResult.length).to.equal(1);
        expect(parseResult.get(0)).to.be.instanceof(namespace.elements.Resource);

        const resource = parseResult.get(0);

        const transition = resource.transitions.get(0);
        const transaction = transition.transactions.get(0);
        const { request } = transaction;

        expect(request.headers).to.be.instanceof(namespace.elements.HttpHeaders);
        expect(request.headers.toValue()).to.deep.equal([
          {
            key: 'Link',
            value: '<https://api.github.com/user/repos?page=3&per_page=100>; rel="next"',
          },
          {
            key: 'Accept',
            value: 'application/json',
          },
        ]);
      });
    });
  });
});
