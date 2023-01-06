const { Router } = require("express");
const apiController = require("../../http/controller/api/api.controller");
const { isAuthenticated } = require("../../http/middlewares/authorization");

const router = new Router();

router.get("/", isAuthenticated , apiController.home);

module.exports = {
  home: router,
};
