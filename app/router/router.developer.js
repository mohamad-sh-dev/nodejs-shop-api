const { randomTokenGenerator } = require("../utilities/functions");
const bcrypt = require("bcrypt");

const { Router } = require("express");
const router = new Router();

router.get("/random-number", (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: randomTokenGenerator(),
  });
});
router.get("/hash-string/:string", (req, res, next) => {
  const { string } = req.params;
  console.log(string);
  const salt = bcrypt.genSaltSync(10);
  const hashString = bcrypt.hashSync(string, salt);
  res.status(200).json({
    status : 'success' ,
    data : hashString
  });
});

module.exports = {
  DeveloperRouets: router,
};
