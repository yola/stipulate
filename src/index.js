import defaultsDeep from 'lodash.defaultsdeep';
import pickBy from 'lodash.pickby';
import makeOkCheck from './make-ok-check';

class Stipulate {

  constructor(options) {
    this.baseOptions = options;
  }

  beforeRequest(request) {
    return request;
  }

  afterResponse(response) {
    return response;
  }

  send(url, options) {
    const config = defaultsDeep({}, options, this.baseOptions);

    if(config.headers) {
      config.headers = pickBy(config.headers, (value) => value);
    }

    const request = new Request(url, config);
    const prefixedRequest = this.beforeRequest(request);
    const checkOk = makeOkCheck(config);

    return fetch(prefixedRequest)
      .then(checkOk)
      .then(this.afterResponse);
  }
}

export default Stipulate
