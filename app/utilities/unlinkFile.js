const path = require('path');

const fsPromises = require('fs').promises;

async function unlinkFile(filePath) {
  filePath = path.join(__dirname, '..', '..', 'public', filePath);
  await fsPromises.unlink(filePath);
}

module.exports = unlinkFile;
