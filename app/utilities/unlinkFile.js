const path = require('path');

const fs = require('fs');

function unlinkFile(filePaths = []) {
  const copyFilePaths = filePaths.filter((filePath) => !filePath.search('default.jpg'));
  return new Promise((resolve, reject) => {
    if (copyFilePaths.length <= 0) resolve();
    for (let i = 0; i < copyFilePaths.length; i += 1) {
      copyFilePaths[i] = path.join(__dirname, '..', '..', 'public', 'uploads', copyFilePaths[i].split('uploads')[1]);
      fs.unlink(copyFilePaths, (err) => {
        if (err) return reject(err);
        resolve();
      });
    }
  });
}

module.exports = unlinkFile;
