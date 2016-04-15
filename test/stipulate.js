import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import stipulate from '../src/stipulate';

chai.use(chaiAsPromised);

// error handling tested elsewhere; bypass it
const okBypass = () => true;
// mock response that can respond to different data
// extraction methods.
const responseMock = (url, options) => {
  const jsonData = Promise.resolve({ some: 'json data' });
  const textData = Promise.resolve('some text data');
  const response = Promise.resolve({
    json: () => jsonData,
    text: () => textData
  });

  return response;
};

const url = '/foo';
const opts = {
  bar: 'baz',
  test: okBypass
};

describe('stipulate', () => {

  before(() => global.fetch = responseMock);

  after(() => delete global.fetch);

  it('calls Fetch with the URL and options given, and extracts json', () => {
    const results = stipulate(url, opts);

    return expect(results).to.eventually.deep.equal({ some: 'json data' });
  });

  it('can be given an alternate data type to extract from response', () => {
    const results = stipulate(url, opts, 'text');

    return expect(results).to.eventually.equal('some text data');
  });

});
