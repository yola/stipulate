import buildOptions from '../src/build-options';
import {expect} from 'chai';

describe('buildOptions', () => {

  it('takes up to two sets of options and merges them', () => {
    const result = buildOptions({ foo: 'bar' }, { fizz: 'buzz' });

    expect(result).to.deep.equal({ foo: 'bar', fizz: 'buzz' });
  });

  it('returns object with same options when given one set', () => {
    const a = {
      foo: 'bar'
    };

    expect(buildOptions(a)).to.deep.equal(a);
    expect(buildOptions(undefined, a)).to.deep.equal(a);
  });

  it('returns empty object when given nothing', () => {
    expect(buildOptions()).to.deep.equal({});
  });

  it('prioritizes key:value pairs in the first option set', () => {
    const result = buildOptions({ foo: 'GOOD' }, { foo: 'BAD' });

    expect(result).to.deep.equal({ foo: 'GOOD' });
  });

  it('merges deep option sets', () => {
    const a = {
      foo: 'bar',
      fizz: {
        buzz: 'GOOD'
      }
    };
    const b = {
      eany: 'meany',
      fizz: {
        buzz: 'BAD',
        miney: 'moe'
      }
    };
    const expected = {
      eany: 'meany',
      foo: 'bar',
      fizz: {
        buzz: 'GOOD',
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
        zap: 'BAD'
      }
    };
    const expected = {
      headers: {
        fizz: 'buzz'
      }
    };

    expect(buildOptions(a, b)).to.deep.equal(expected);
  });

  it('doesnt merge `okCodes`. prioritizes first option set', () => {
    const a = {
      okCodes: [400]
    };
    const b = {
      okCodes: [403, 401]
    };
    expect(buildOptions(a, b)).to.deep.equal(a);
  });
});
