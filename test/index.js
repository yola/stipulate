import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Stipulate from '../src';

chai.use(chaiAsPromised);

// error handling tested elsewhere; bypass it
const okBypass = () => true;

describe('Stipulate class', () => {

  it('holds onto base options you instantiate it with', () => {
    const options = {
      foo: 'bar'
    };
    const stipulateFoo = new Stipulate(options);

    expect(stipulateFoo.baseOptions).to.deep.equal(options);
  });

  describe('beforeRequest method', () => {
    it('leaves the url and options unmodified by default', () => {
      const url = '/foo';
      const options = {
        fizz: 'buzz'
      };
      const stipulate = new Stipulate();

      expect(stipulate.beforeRequest(url, options))
        .to.deep.equal([url, options]);
    });
  });

  describe('afterResponse method', () => {
    it('passes a response through untouched, by default', () => {
      const response = {
        hello: 'world'
      };
      const stipulate = new Stipulate();

      expect(stipulate.afterResponse(response)).to.deep.equal(response);
    });
  });

  describe('send method', () => {
    before(() => {
      global.fetch = (url, options) => {
        return Promise.resolve([url, options]);
      };
    });

    after(() => {
      delete global.fetch;
    });

    it('calls Fetch with the URL and any options given', () => {
      const stipulate = new Stipulate();
      const url = '/foo';
      const opts = {
        bar: 'baz',
        test: okBypass
      };
      const results = stipulate.send(url, opts);

      return expect(results).to.eventually.deep.equal([url, opts]);
    });

    it('merges options given with base options', () => {
      const stipulate = new Stipulate({ foo: 'bar' });
      const url = '/foo';
      const opts = {
        fizz: 'buzz',
        test: okBypass
      };
      const combinedOpts = {
        foo: 'bar',
        fizz: 'buzz',
        test: okBypass
      };
      const results = stipulate.send(url, opts);

      return expect(results).to.eventually.deep.equal([url, combinedOpts]);
    });

    it('prioritizes latest given options when duplicating base options', () => {
      const stipulate = new Stipulate({ foo: 'bar' });
      const url = '/foo';
      const opts = {
        foo: 'baz',
        test: okBypass
      };
      const results = stipulate.send(url, opts);

      return expect(results).to.eventually.deep.equal([url, opts]);
    });

    it('does not include headers with a null or "" value', () => {
      const url = '/fizz';
      const nullHeader = {
        headers: { foo: null },
        test: okBypass
      };
      const emptyHeader = {
        headers: { bar: '' }
      };
      const expectedOpts = {
        headers: {},
        test: okBypass
      };
      const stipulate = new Stipulate(nullHeader);
      const results = stipulate.send(url, emptyHeader);

      return expect(results).to.eventually.deep.equal([url, expectedOpts]);
    });

    it('excludes base option header when set to null or ""', () => {
      const url = '/boop';
      const baseWithHeader = {
        headers: { foo: 'bar' },
        test: okBypass
      };
      const override = {
        headers: { foo: null }
      };
      const expectedOpts = {
        headers: {},
        test: okBypass
      };
      const stipulate = new Stipulate(baseWithHeader);
      const results = stipulate.send(url, override);

      return expect(results).to.eventually.deep.equal([url, expectedOpts]);
    });

    it('accepts a query object and merges it into the url', () => {
      const url = '/foo?one=yes&two=yes';
      const query = {
        two: 'no',
        three: 'maybe'
      };
      const opts = {
        test: okBypass
      };

      const stipulate = new Stipulate();
      const results = stipulate.send(url, opts, query);

      return results.then(([url]) => {
        expect(url).to.contain('two=no', 'one=yes', 'three=maybe');
      });
    });
  });
});
