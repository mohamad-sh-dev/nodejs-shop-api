const createHttpError = require('http-errors');
const { REQUEST_BODY } = require('../../utilities/constants');

function validateRequestBody(schema, bodyType = REQUEST_BODY) {
  return async (req, res, next) => {
    console.log(req.params);
    try {
      await schema.validateAsync(req[bodyType]);
      next();
    } catch (error) {
      next(createHttpError.BadRequest(error.message));
    }
  };
}
module.exports = {
  validateRequestBody,
};
