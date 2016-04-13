import chai, {expect} from 'chai';
import buildOptions from '../src/build-options';

describe('buildOptions', () => {

  it('takes up to two sets of options and merges them', () => {
    const result = buildOptions({ foo: 'bar' }, { fizz: 'buzz' });

    expect(result).to.deep.equal({ foo: 'bar', fizz: 'buzz' });
  });

  it('doesnt have to be given anything', () => {
    expect(buildOptions()).to.deep.equal({});
  });

  it('prioritizes key:value pairs in the first option set', () => {
    const result = buildOptions({ foo: 'bar' }, { foo: 'baz' });

    expect(result).to.deep.equal({ foo: 'bar' });
  });

  it('merges deep option sets', () => {
    const a = {
      foo: 'bar',
      fizz: {
        buzz: 'zip'
      }
    };
    const b = {
      eany: 'meany',
      fizz: {
        buzz: 'zap',
        miney: 'moe'
      }
    };
    const expected = {
      eany: 'meany',
      foo: 'bar',
      fizz: {
        buzz: 'zip',
        miney: 'moe'
      }
    };

    expect(buildOptions(a, b)).to.deep.equal(expected);
  });

  it('leaves out `null` or empty string header key:value pairs', () => {
    const a = {
      headers: {
        fizz: 'buzz',
        zap: null
      }
    };
    const b = {
      headers: {
        zip: '',
        zap: 'zoom'
      }
    };
    const expected = {
      headers: {
        fizz: 'buzz'
      }
    };

    expect(buildOptions(a, b)).to.deep.equal(expected);
  });

  it('doesnt merge `okCodes`. first option set overrides second if both present', () => {
    const a = {
      okCodes: [400]
    };
    const b = {
      okCodes: [403, 401]
    };
    expect(buildOptions(a, b)).to.deep.equal(a);
  });
});
