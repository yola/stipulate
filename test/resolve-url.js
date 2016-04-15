import {expect} from 'chai';
import resolveUrl from '../src/resolve-url';

describe('resolveUrl', () => {
  it('takes a url string and an optional query object, returns a url', () => {
    const q = {
      fizz: 'buzz'
    };

    expect(resolveUrl('http://some.domain/foo'))
      .to.equal('http://some.domain/foo');
    expect(resolveUrl('/foo', q)).to.equal('/foo?fizz=buzz');
  });

  it('merges query params from query object and the url', () => {
    const q = {
      fizz: 'buzz'
    };

    expect(resolveUrl('/foo?bar=baz', q)).to.match(/^\/foo\?/)
      .and.contain('bar=baz', 'fizz=buzz');
  });

  it('prioritizes key:value pairs from query object over url string', () => {
    const q = {
      fizz: 'buzz'
    };

    expect(resolveUrl('test/foo?fizz=bar', q)).to.equal('test/foo?fizz=buzz');
  });

  it('leaves out `null` and empty string key:value pairs', () => {
    const q = {
      fizz: '',
      buzz: null
    };

    expect(resolveUrl('/foo?fizz=fuzz', q)).to.equal('/foo');
  });
});
