import defaultsDeep from 'lodash.defaultsdeep';
import pickBy from 'lodash.pickby';
import makeOkCheck from './make-ok-check';
import buildOptions from './build-options';
import resolveUrl from './resolve-url';

class Stipulate {

  constructor(options) {
    this.baseOptions = options;
  }

  beforeRequest(url, options) {
    return [url, options];
  }

  afterResponse(response) {
    return response;
  }

  send(urlString, options, query) {
    const config = buildOptions(options, this.baseOptions);
    const url = resolveUrl(urlString, query);

    const requestArguments = this.beforeRequest(url, config);
    const checkOk = makeOkCheck(config);

    return fetch(...requestArguments)
      .then(checkOk)
      .then(this.afterResponse.bind(this));
  }
};

class JsonStipulate extends Stipulate {

  constructor(options) {
    const baseJsonOpts = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    const mergedOpts = buildOptions(options, baseJsonOpts);

    super(mergedOpts);
  }

  beforeRequest(url, options) {
    if(typeof options.body !== 'string') {
      options.body = JSON.stringify(options.body);
    }

    return [url, options];
  }

  afterResponse(response) {
    return response.json();
  }
}

export { JsonStipulate };
export default Stipulate;
