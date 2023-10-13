const { StatusCodes: httpStatusCodes } = require('http-status-codes');
const { sendResponseToClient, resolveHostAndProtocol } = require('../../../utilities/functions');
const { messageCenter } = require('../../../utilities/messages');
const BaseController = require('../baseController');
const {
 PAYMENT_STATUS_CODES, STATIC_ROUTES, ZARINPAL_SANDBOX, API_DOCUMENT_ROUTE
} = require('../../../utilities/constants');
const { PaymentModel } = require('../../../model/payment');
const { Payment } = require('../../../modules/payment');

class PaymentController extends BaseController {
    constructor() {
        super();
        this.paymentModule = new Payment(process.env.SANDBOX_PAYMENT);
    }

    async payment(req, res, next) {
        try {
            const { _id: userID } = req.user;
            await this.paymentModule.config(userID, ZARINPAL_SANDBOX.DESCRIPTION);
            const redirectUrl = await this.paymentModule.payment();
            return sendResponseToClient(res, messageCenter.public.success, httpStatusCodes.OK, { redirectUrl });
        } catch (error) {
            next(error);
        }
    }

    async verify(req, res, next) {
        try {
            const { Authority, Status } = req.query;
            const returnUrl = `${await resolveHostAndProtocol(req)}${API_DOCUMENT_ROUTE}`;
            if (Status === PAYMENT_STATUS_CODES.NOT_OK) {
                return res.render(STATIC_ROUTES.VIEWS.PAYMENT_TEMPLATE, {
                    pageTitle: httpStatusCodes.BAD_REQUEST,
                    message: messageCenter.PAYMENTS.FAILED,
                    returnUrl
                });
            }
            const paymentInfo = await PaymentModel.findOne({
                authority: Authority,
                verify: false
            });
            if (!paymentInfo) {
                return res.render(STATIC_ROUTES.VIEWS.PAYMENT_TEMPLATE, {
                    pageTitle: httpStatusCodes.NOT_FOUND,
                    message: messageCenter.PAYMENTS.NOT_FOUND,
                    returnUrl
                });
            }

            await this.paymentModule.verify(Authority, paymentInfo);
            return res.render(STATIC_ROUTES.VIEWS.PAYMENT_TEMPLATE, {
                pageTitle: httpStatusCodes.OK,
                message: messageCenter.PAYMENTS.SUCCESS,
                returnUrl
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PaymentController();
