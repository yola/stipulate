import buildOptions from './build-options';
import enforceOk from './enforce-ok';
import resolveUrl from './resolve-url';

const stipulate = (url, options, extract = 'json') => {
  return fetch(url, options)
    .then(enforceOk(options))
    .then((res) => res[extract]());
};

export { enforceOk, buildOptions, resolveUrl };
export default stipulate;

