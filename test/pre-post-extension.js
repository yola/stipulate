import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Stipulate from '../src';

chai.use(chaiAsPromised);

class ExtStip extends Stipulate {
  prefix(request) {
    request.foo = 'bar';
    return request;
  }

  postfix(response) {
    return response.fizz;
  }
}

describe('Extended Stipulate', () => {
  before(() => {
    global.Request = function(url, options) {
      this.url = url;
      this.options = options;
    };
  });

  after(() => delete global.Request );

  describe('with custom prefix method', () => {
    before(() => {
      global.fetch = (request) => {
        if(request.foo === 'bar') return Promise.resolve(request);

        return Promise.reject('prefix not called before fetch');
      };
    });

    after(() => delete global.fetch );

    it('prefix method is called with request prior to fetch', () => {
      const extStip = new ExtStip();
      const request = extStip.send('/foo');

      return expect(request).to.be.fulfilled;
    });
  });

  describe('with custom postfix method', () => {
    before(() => {
      global.fetch = () => {
        return Promise.resolve({ fizz: 'buzz' });
      };
    });

    after(() => delete global.fetch );

    it('postfix method is called with response after fetch', () => {
      const extStip = new ExtStip();
      const request = extStip.send('/foo');

      return expect(request).to.eventually.equal('buzz');
    });
  });
});
