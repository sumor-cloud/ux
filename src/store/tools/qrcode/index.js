import load from '../load';
const resourceUrl = 'https://library.sumor.com/qrcode/qrcode.min.js';

export default async (url) => {
  await load.js(resourceUrl);
  return await new Promise((resolve) => {
    window.QRCode.toDataURL(url, (err, data) => {
      resolve(data);
    });
  });
};
