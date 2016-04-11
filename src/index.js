import defaultsDeep from 'lodash.defaultsdeep';

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
    const request = new Request(url, config);
    const prefixedRequest = this.prefix(request);

    return fetch(prefixedRequest).then(this.postfix);
  }
}

export default Stipulate
