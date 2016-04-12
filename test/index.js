import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Stipulate from '../src';

chai.use(chaiAsPromised);

describe('Stipulate class', () => {
  it('holds onto base options you instantiate it with', () => {
    const options = {
      foo: 'bar'
    };
    const stipulateFoo = new Stipulate(options);

    expect(stipulateFoo.baseOptions).to.deep.equal(options);
  });

  describe('prefix method', () => {
    it('passes a request through untouched, by default', () => {
      const request = {
        fizz: 'buzz'
      };
      const stipulate = new Stipulate();

      expect(stipulate.prefix(request)).to.deep.equal(request);
    });
  });

  describe('postfix method', () => {
    it('passes a response through untouched, by default', () => {
      const response = {
        hello: 'world'
      };
      const stipulate = new Stipulate();

      expect(stipulate.postfix(response)).to.deep.equal(response);
    });
  });

  describe('send method', () => {
    before(() => {
      global.fetch = (request) => {
        return Promise.resolve(request);
      };

      global.Request = function(url, options) {
        this.url = url;
        this.options = options;
      };
    });

    after(() => {
      delete global.fetch;
      delete global.Request;
    });

    it('calls Fetch with a Request for the URL and any options given', () => {
      const stipulate = new Stipulate();
      const url = '/foo';
      const opts = {
        bar: 'baz'
      };
      const expected = new Request(url, opts);
      const results = stipulate.send(url, opts);

      return expect(results).to.eventually.deep.equal(expected);
    });

    it('merges options given with base options', () => {
      const stipulate = new Stipulate({ foo: 'bar' });
      const url = '/foo';
      const opts = {
        fizz: 'buzz'
      };
      const combinedOpts = {
        foo: 'bar',
        fizz: 'buzz'
      };
      const expected = new Request(url, combinedOpts);
      const results = stipulate.send(url, opts);

      return expect(results).to.eventually.deep.equal(expected);
    });

    it('prioritizes latest given options when duplicating base options', () => {
      const stipulate = new Stipulate({ foo: 'bar' });
      const url = '/foo';
      const opts = {
        foo: 'baz'
      };
      const expected = new Request(url, opts);
      const results = stipulate.send(url, opts);

      return expect(results).to.eventually.deep.equal(expected);
    });

    it('does not include headers with no null or "" value', () => {
      const url = '/fizz';
      const nullHeader = {
        headers: { foo: null }
      };
      const emptyHeader = {
        headers: { bar: '' }
      };
      const expected = new Request(url, { headers: {} });
      const stipulate = new Stipulate(nullHeader);
      const results = stipulate.send(url, emptyHeader);

      return expect(results).to.eventually.deep.equal(expected);
    });

    it('excludes base option header when set to null or ""', () => {
      const url = '/boop';
      const baseWithHeader = {
        headers: { foo: 'bar' }
      };
      const override = {
        headers: { foo: null }
      };
      const expected = new Request(url, { headers: {} });
      const stipulate = new Stipulate(baseWithHeader);
      const results = stipulate.send(url, override);

      return expect(results).to.eventually.deep.equal(expected);
    });
  });
});
