import axios from 'axios';

export default async (api, params, options) => {
  options = options || {};

  let multipart = false;
  for (const i in params) {
    if (params[i] instanceof File) { multipart = true; }
  }
  let requestData;
  if (multipart) {
    requestData = new FormData();
    for (const i in params) {
      if (typeof params[i] === 'object' && !(params[i] instanceof File)) {
        params[i] = JSON.stringify(params[i]);
      }
      requestData.append(i, params[i]);
    }
  } else {
    requestData = params;
  }
  try {
    return await axios({
      method: 'POST',
      url: api,
      data: requestData,
      headers: {
        'Content-Type': multipart ? 'multipart/form-data' : 'application/json;charset=utf-8',
        'Accept-Language': options.language ? options.language : undefined,
        'sumor-timezone': options.timezone ? options.timezone : undefined // -new Date().getTimezoneOffset(),
      }
    });
  } catch (e) {
    let data = e.response?e.response.data:{};
    return {
      error: true,
      code:e.code,
      message:e.message,
      ...data,
    };
  }
};
