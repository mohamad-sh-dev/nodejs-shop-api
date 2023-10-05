const { Router } = require('express');
const { isAuthenticated } = require('../../http/middlewares/authorization');
const paymentController = require('../../http/controller/api/payment.controller');

const router = new Router();

router.post('/', isAuthenticated, paymentController.payment);
router.get('/verify', paymentController.verify);

module.exports = {
    paymentRoutes: router
};
