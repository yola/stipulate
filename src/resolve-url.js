import _ from 'lodash';
import urlJoin from 'url-join';

const resolveUrl = function(urlString, query) {
  let parsedUrlQuery = {};
  let urlWithoutParams = urlString;
  const hasParams = urlString.includes('?');

  if (hasParams){
    const urlSplit = urlString.split('?');
    parsedUrlQuery = Object.fromEntries(
        new URLSearchParams(urlSplit[1])
    );
    urlWithoutParams = urlSplit[0];
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
