import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Stipulate from '../src';

chai.use(chaiAsPromised);

class ExtStip extends Stipulate {
  beforeRequest(url, options) {
    options.foo = 'bar';
    return [url, options];
  }

  afterResponse(response) {
    return response.fizz;
  }
}

describe('Before- and after-fetch hooks', () => {
  describe('"beforeRequest" hook method', () => {
    before(() => {
      global.fetch = (url, options) => {
        if(options.foo === 'bar') {
          return Promise.resolve({ ok: true });
        }

        return Promise.reject('beforeRequest not called before fetch');
      };
    });

    after(() => delete global.fetch );

    it('is: called prior to fetch; given the url and options', () => {
      const extStip = new ExtStip();
      const request = extStip.send('/foo');

      return expect(request).to.be.fulfilled;
    });
  });

  describe('"afterResponse" hook method', () => {
    before(() => {
      global.fetch = () => {
        return Promise.resolve({ fizz: 'buzz', ok: true });
      };
    });

    after(() => delete global.fetch );

    it('is: called after a successful fetch; given the response', () => {
      const extStip = new ExtStip();
      const request = extStip.send('/foo');

      return expect(request).to.eventually.equal('buzz');
    });
  });
});
