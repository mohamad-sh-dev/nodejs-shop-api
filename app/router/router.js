const { Router } = require("express");
const { userAuthentication } = require("./user/userAuth.router");
const { DeveloperRouets } = require("./router.developer");
const { adminPanelRoutes } = require("./admin/admin.routes");
const { home } = require("../http/controller/api/api.controller");
const router = new Router();

router.use("/admin/panel", adminPanelRoutes);
router.use("/user/authentication", userAuthentication);
router.use("/developer", DeveloperRouets);
router.use("/", home);

module.exports = {
  allRouets: router,
};
