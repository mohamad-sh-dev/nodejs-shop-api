const { Router } = require('express');
const { userAuthentication } = require('./user/userAuth.router');
const { DeveloperRouets } = require('./router.developer');
const { adminPanelRoutes } = require('./admin/category.routes');
const { adminBlogsRoutes } = require('./admin/blogs.routes');
const { adminProductsRoutes } = require('./admin/products.routes');
const { home } = require('../http/controller/api/api.controller');

const router = new Router();

router.use('/admin/products', adminProductsRoutes);
router.use('/admin/blogs', adminBlogsRoutes);
router.use('/admin/panel', adminPanelRoutes);
router.use('/user/authentication', userAuthentication);
router.use('/developer', DeveloperRouets);
router.use('/', home);

module.exports = {
  allRouets: router,
};
