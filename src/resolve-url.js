import url from 'url';
import defaults from 'lodash.defaults';
import pickBy from 'lodash.pickby';

const resolveUrl = function(urlString, query) {
  const parsedUrl = url.parse(urlString, true);

  const mergedQuery = defaults({}, query, parsedUrl.query);
  const fullQuery = pickBy(mergedQuery, (value) => value);

  delete parsedUrl.search;
  parsedUrl.query = fullQuery;

  return url.format(parsedUrl);
};

export default resolveUrl;
