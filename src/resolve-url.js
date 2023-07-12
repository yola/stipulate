import _ from 'lodash';
import urlJoin from 'url-join';

const resolveUrl = function(urlString, query) {
  const parselUrlQuery = Object.fromEntries(
      new URLSearchParams(urlString)
  );

  const mergedQuery = _.defaults({}, query, parselUrlQuery);
  const fullQuery = _.pickBy(mergedQuery, (value) => value);

  const searchParams = new URLSearchParams(fullQuery);

  return urlJoin(urlString, `?${searchParams.toString()}`);
};

export default resolveUrl;
