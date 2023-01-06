const { Router } = require("express");
const { home } = require("./api/api");
const { userAuthentication } = require("./user/userAuth.router");
const { DeveloperRouets } = require("./router.developer");
const router = new Router();

router.use("/" , home);
router.use('/user/authentication' , userAuthentication)
router.use('/developer', DeveloperRouets);

module.exports = {
  allRouets: router,
};


