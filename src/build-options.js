import defaultsDeep from 'lodash.defaultsdeep';
import pickBy from 'lodash.pickby';

const buildOptions = function(priority, defaults) {
  const options = defaultsDeep({}, priority, defaults);

  if(options.headers) {
    options.headers = pickBy(options.headers, (value) => value);
  }

  if(priority && priority.okCodes) {
    options.okCodes = priority.okCodes;
  }

  return options;
};

export default buildOptions;
