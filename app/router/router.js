/* eslint-disable import/no-extraneous-dependencies */
const { Router } = require('express');
const { graphqlHTTP } = require('express-graphql');
const { userAuthentication } = require('./user/user.auth.router');
const { DeveloperRouets } = require('./router.developer');
const { adminPanelRoutes } = require('./admin/categories/category.routes');
const { adminBlogsRoutes } = require('./admin/blogs/blogs.routes');
const { adminProductsRoutes } = require('./admin/products/products.routes');
const { adminCoursesRoutes } = require('./admin/courses/courses.routes');
const { adminChaptersRoutes } = require('./admin/courses/chapters.routes');
const { adminEpisodesRoutes } = require('./admin/courses/episodes.routes');
const { home } = require('../http/controller/api/api.controller');
const { adminRolesRoutes } = require('./admin/RBAC/roles.routes');
const { adminPermissionsRoutes } = require('./admin/RBAC/permissions.routes');
const { hasPermission } = require('../http/validations/RBAC.guard');
const { isAuthenticated } = require('../http/middlewares/authorization');
const { userRoutes } = require('./user/user.router');
const { graphQlConfig } = require('../utilities/graphql.config');

const router = new Router();

router.use('/user/authentication', userAuthentication);
router.use('/user', isAuthenticated, hasPermission, userRoutes);
router.use('/admin/roles/', isAuthenticated, hasPermission, adminRolesRoutes);
router.use('/admin/permissions/', isAuthenticated, hasPermission, adminPermissionsRoutes);
router.use('/admin/courses/chapters/episodes', isAuthenticated, hasPermission, adminEpisodesRoutes);
router.use('/admin/products', isAuthenticated, hasPermission, adminProductsRoutes);
router.use('/admin/courses', isAuthenticated, hasPermission, adminCoursesRoutes);
router.use('/admin/courses/chapters', isAuthenticated, hasPermission, adminChaptersRoutes);
router.use('/admin/blogs', isAuthenticated, hasPermission, adminBlogsRoutes);
router.use('/admin/panel', isAuthenticated, hasPermission, adminPanelRoutes);
router.use('/developer', isAuthenticated, DeveloperRouets);
router.use('/graphql', graphqlHTTP(graphQlConfig));
router.use('/', home);

module.exports = {
  allRouets: router,
};
