import _ from 'lodash';
import url from 'url';

const resolveUrl = function(urlString, query) {
  const parsedUrl = url.parse(urlString, true);

  const mergedQuery = _.defaults({}, query, parsedUrl.query);
  const fullQuery = _.pickBy(mergedQuery, (value) => value);

  delete parsedUrl.search;
  parsedUrl.query = fullQuery;

  return url.format(parsedUrl);
};

export default resolveUrl;
