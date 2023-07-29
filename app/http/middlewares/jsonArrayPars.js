function parseToJsonArray(fieldnames) {
  return function (req, res, next) {
    fieldnames.forEach((field) => {
      if (req.body[field]) {
        req.body[field] = JSON.parse(req.body[field]);
      }
    });
    next();
  };
}
module.exports = parseToJsonArray;
