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

describe('Extended Stipulate', () => {
  describe('with custom beforeRequest method', () => {
    before(() => {
      global.fetch = (url, options) => {
        if(options.foo === 'bar') {
          return Promise.resolve({ ok: true });
        }

        return Promise.reject('beforeRequest not called before fetch');
      };
    });

    after(() => delete global.fetch );

    it('beforeRequest method is called with request prior to fetch', () => {
      const extStip = new ExtStip();
      const request = extStip.send('/foo');

      return expect(request).to.be.fulfilled;
    });
  });

  describe('with custom afterResponse method', () => {
    before(() => {
      global.fetch = () => {
        return Promise.resolve({ fizz: 'buzz', ok: true });
      };
    });

    after(() => delete global.fetch );

    it('afterResponse method is called with response after fetch', () => {
      const extStip = new ExtStip();
      const request = extStip.send('/foo');

      return expect(request).to.eventually.equal('buzz');
    });
  });
});
