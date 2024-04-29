export default async function (multi) {
  return await new Promise((resolve) => {
    const uploader = document.createElement('input');
    uploader.type = 'file';
    uploader.name = 'file';
    if (multi) {
      uploader.multiple = 'multiple';
    }
    uploader.addEventListener('change', function (e) {
      if (multi) {
        resolve(e.target.files);
      } else {
        resolve(e.target.files[0]);
      }
    });
    uploader.value = '';
    uploader.click();
  });
}
