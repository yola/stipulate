import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {JsonStipulate} from '../src';

chai.use(chaiAsPromised);

// make no-op test function to bypass okCheck on responses
const okBypass = () => true;

describe('JsonStipulate', () => {
  it('comes with default json-related headers', () => {
    const jsonStip = new JsonStipulate();
    const expectedOpts = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    expect(jsonStip.baseOptions).to.deep.equal(expectedOpts);
  });

  describe('beforeRequest hook', () => {
    let jsonStip;

    before(() => {
      // stub fetch to just pass on a promise for
      // what beforeRequest sends it so we can verify
      global.fetch = (url, options) => Promise.resolve([url, options]);

      jsonStip = new JsonStipulate({ test: okBypass });
      jsonStip.afterResponse = ([url, options]) => options.body;
    });

    after(() => delete global.fetch);

    it('stringifies body content by default', () => {
      const opts = {
        body: {
          foo: true
        }
      };
      const url = '/boop';
      const expected = "{\"foo\":true}";

      return expect(jsonStip.send(url, opts))
        .to.eventually.equal(expected);
    });

    it('leaves string bodies alone', () => {
      const opts = {
        body: 'some string'
      };
      const url = '/beep';

      return expect(jsonStip.send(url, opts))
        .to.eventually.equal('some string');
    });
  });

  describe('afterResponse hook', () => {
    before(() => {
      // stub fetch responding with a promise for
      // a request object having a json function
      global.fetch = () => Promise.resolve({ json: () => true });
    });

    after(() => delete global.fetch);

    it('tries to extract json from the response by default', () => {
      const jsonStip = new JsonStipulate({ test: okBypass });

      return expect(jsonStip.send('/foo')).to.eventually.equal(true);
    });
  });
});
