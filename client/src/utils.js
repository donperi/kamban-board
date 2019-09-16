export const apiRequest = async (url, options) => {
  const defaultOptions = {
    headers: {
      'content-type': 'application/json'
    }
  }
  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options
    });
    if (!response.ok) {
      return Promise.resolve({
        error: true,
        status: response.status
      });
    }

    return response.json();
  } catch (e) {
    return Promise.resolve({
      error: true,
      status: 500,
      message: e.message
    })
  }
}

export const apiUrl = (url, query = {}) => {
  url = new URL(`${window.location.protocol}//${window.location.host}${url}`);
  Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));

  return url;
};
