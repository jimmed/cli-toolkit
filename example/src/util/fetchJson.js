import fetch from 'node-fetch';

const makeError = formatMessage => class extends Error {
  constructor(artifacts) {
    super(
      typeof artifacts === 'function' ? formatMessage(artifacts) : artifacts,
    );
    Object.assign(this, artifacts);
  }
};

const FetchRequestError = makeError('FetchRequestError');
const FetchHTTPError = makeError('FetchRequestError');
const FetchJSONError = makeError('FetchJSONError');

const fetchCarefully = async (url, options) => {
  let response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    throw new FetchRequestError({
      url,
      options,
      response,
      error,
    });
  }
  if (!response.ok) {
    throw new FetchHTTPError({ url, options, response });
  }
  return response;
};

const fetchJson = async (url, options) => {
  const response = await fetchCarefully(url, options);
  try {
    return await response.json();
  } catch (error) {
    throw new FetchJSONError({
      url,
      options,
      response,
      error,
    });
  }
};

export default fetchJson;
