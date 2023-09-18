const path = require('path');

const fs = require('fs');

function unlinkFile(filePath = []) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < filePath.length; i += 1) {
      let copyFilePath = filePath[i];
      copyFilePath = path.join(__dirname, '..', '..', 'public', 'uploads', filePath[i].split('uploads')[1]);
      fs.unlink(copyFilePath, (err) => {
        if (err) return reject(err);
        resolve();
      });
    }
  });
}

module.exports = unlinkFile;
