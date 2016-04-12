import defaultsDeep from 'lodash.defaultsdeep';
import pickBy from 'lodash.pickby';

class Stipulate {

  constructor(options) {
    this.baseOptions = options;
  }

  prefix(request) {
    return request;
  }

  postfix(response) {
    return response;
  }

  send(url, options) {
    const config = defaultsDeep({}, options, this.baseOptions);

    if(config.headers) {
      config.headers = pickBy(config.headers, (value) => value);
    }

    const request = new Request(url, config);
    const prefixedRequest = this.prefix(request);

    return fetch(prefixedRequest).then(this.postfix);
  }
}

export default Stipulate
