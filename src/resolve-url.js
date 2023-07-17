import _ from 'lodash';
import urlJoin from 'url-join';

const resolveUrl = function(urlString, query) {
  let parsedUrlQuery = {};
  let urlWithoutParams = urlString;
  const queryStart = urlString.lastIndexOf('?');

  if (queryStart !== -1){
    const paramStr = urlString.slice(queryStart);
    parsedUrlQuery = Object.fromEntries(
        new URLSearchParams(paramStr)
    );
    urlWithoutParams = urlString.slice(0, queryStart);
  }

  const mergedQuery = _.defaults({}, query, parsedUrlQuery);
  const fullQuery = _.pickBy(mergedQuery, (value) => value);

  const searchParams = new URLSearchParams(fullQuery);
  const searchParamsString = searchParams.toString();

  if (searchParamsString){
    return urlJoin(urlWithoutParams, `?${searchParamsString}`);
  }

  return urlWithoutParams;
};

export default resolveUrl;
