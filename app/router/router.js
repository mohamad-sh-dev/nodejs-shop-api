const { Router } = require('express');
const { userAuthentication } = require('./user/userAuth.router');
const { DeveloperRouets } = require('./router.developer');
const { adminPanelRoutes } = require('./admin/categories/category.routes');
const { adminBlogsRoutes } = require('./admin/blogs/blogs.routes');
const { adminProductsRoutes } = require('./admin/products/products.routes');
const { adminCoursesRoutes } = require('./admin/courses/courses.routes');
const { adminChaptersRoutes } = require('./admin/courses/chapters.routes');
const { adminEpisodesRoutes } = require('./admin/courses/episodes.routes');
const { home } = require('../http/controller/api/api.controller');

const router = new Router();

router.use('/admin/courses/chapters/episodes', adminEpisodesRoutes);
router.use('/admin/products', adminProductsRoutes);
router.use('/admin/courses', adminCoursesRoutes);
router.use('/admin/courses/chapters', adminChaptersRoutes);
router.use('/admin/blogs', adminBlogsRoutes);
router.use('/admin/panel', adminPanelRoutes);
router.use('/user/authentication', userAuthentication);
router.use('/developer', DeveloperRouets);
router.use('/', home);

module.exports = {
  allRouets: router,
};
