import _ from 'lodash';

const buildOptions = function(priority, defaults) {
  const options = _.defaultsDeep({}, priority, defaults);

  if(options.headers) {
    options.headers = _.pickBy(options.headers, (value) => value);
  }

  if(priority && priority.okCodes) {
    options.okCodes = priority.okCodes;
  }

  return options;
};

export default buildOptions;
