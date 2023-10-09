const axios = require('axios');
const { StatusCodes: httpStatusCodes } = require('http-status-codes');
const createHttpError = require('http-errors');
const { PaymentModel } = require('../model/payment');
const { UserModel } = require('../model/user');
const { PAYMENT_STATUS_CODES } = require('../utilities/constants');
const { messageCenter } = require('../utilities/messages');
const { invoiceNumberGenerator } = require('../utilities/invoiceNumberGenerator');

class Payment {
    constructor(sandbox = false) {
        this.userID = '';
        this.userCart = {};
        this.totalAmount = 0;
        this.sandbox = sandbox;
        this.requestDataConfig = {};
        this.requestOptionsConfig = {};
    }

    async config(userID, description) {
        this.userID = userID;
        const userInfo = await UserModel.findById(userID);
        this.userCart = userInfo.cart;
        this.totalAmount = this.userCart.totalPayAmounts.totalAmount;
        this.requestDataConfig = this.sandbox ? {
            payment: {
                MerchantID: process.env.MERCHANT_ID,
                Amount: this.totalAmount,
                Description: description,
                CallbackURL: process.env.PAYMENT_CALLBACK_URL,
                Mobile: userInfo.mobile,
                Email: userInfo.email || ''
            },
            verify: (authority, paymentInfo) => ({
                MerchantID: process.env.MERCHANT_ID,
                Amount: paymentInfo.amount,
                Authority: authority
            })
        } : {
            payment: {
                merchant_id: process.env.MERCHANT_ID,
                amount: this.totalAmount,
                description: this.paymentDescription,
                callback_url: process.env.PAYMENT_CALLBACK_URL,

                metadata: {
                    mobile: userInfo.mobile,
                    email: userInfo.email || ''
                }
            },
            verify: (authority, paymentInfo) => ({
                merchant_id: process.env.MERCHANT_ID,
                amount: paymentInfo.amount,
                authority
            })
        };
        this.requestOptionsConfig = this.sandbox ? {
            payment: {
                method: process.env.ZARINPAL_SANDBOX_PAYMENT_METHOD,
                url: `${process.env.ZARINPAL_SANDBOX_REQUEST_PROTOCOL}://${process.env.ZARINPAL_SANDBOX_PAYMENT_URL}`,
            },
            startPay: {
                method: process.env.ZARINPAL_SANDBOX_STARTPAY_METHOD,
                url: `${process.env.ZARINPAL_SANDBOX_REQUEST_PROTOCOL}://${process.env.ZARINPAL_SANDBOX_STARTPAY_URL}`,
            },
            verify: {
                method: process.env.ZARINPAL_SANDBOX_VERIFY_METHOD,
                url: `${process.env.ZARINPAL_SANDBOX_REQUEST_PROTOCOL}://${process.env.ZARINPAL_SANDBOX_VERIFY_URL}`,
            },
        } : {
            payment: {
                method: process.env.ZARINPAL_PAYMENT_METHOD,
                url: `${process.env.ZARINPAL_REQUEST_PROTOCOL}://${process.env.ZARINPAL_PAYMENT_URL}`,
            },
            startPay: {
                method: process.env.ZARINPAL_STARTPAY_METHOD,
                url: `${process.env.ZARINPAL_REQUEST_PROTOCOL}://${process.env.ZARINPAL_STARTPAY_URL}`,
            },
            verify: {
                method: process.env.ZARINPAL_VERIFY_METHOD,
                url: `${process.env.ZARINPAL_REQUEST_PROTOCOL}://${process.env.ZARINPAL_VERIFY_URL}`,
            },
        };
    }

    async payment() {
        if (this.requestDataConfig.payment.Amount <= 0) throw createHttpError.BadRequest(messageCenter.USER_CART.EMPTY);
        const response = await axios(this.requestOptionsConfig.payment.url, {
            method: this.requestOptionsConfig.payment.method,
            data: this.requestDataConfig.payment
        });
        const responseData = response.data;
        const { Authority, Status } = responseData;
        if (Status !== PAYMENT_STATUS_CODES.OK) throw createHttpError.InternalServerError(messageCenter.public.internalServerErrorMsg);
        await PaymentModel.create({
            user: this.userID,
            authority: Authority,
            primaryPayStatus: Status === PAYMENT_STATUS_CODES.OK,
            userCart: this.userCart,
            amount: this.totalAmount
        });
        const redirectUrl = `${this.requestOptionsConfig.startPay.url}${responseData.Authority}`;
        return redirectUrl;
    }

    async verify(authority, paymentInfo) {
        const verifyTransactionBody = this.requestDataConfig.verify(authority, paymentInfo);
        const verifyPayment = await axios(this.requestOptionsConfig.verify.url, {
            method: this.requestOptionsConfig.verify.method,
            data: verifyTransactionBody
        });
        const verifyResponseData = verifyPayment.data;
        if (verifyResponseData.Status !== PAYMENT_STATUS_CODES.OK) throw createHttpError.InternalServerError(messageCenter.public.internalServerErrorMsg);
        const user = await UserModel.findOne({ _id: paymentInfo.user });
        await PaymentModel.updateOne({ authority }, {
            $set: {
                verify: true,
                invoiceNumber: invoiceNumberGenerator()
            }
        });
        await UserModel.updateOne({ _id: paymentInfo.user }, {
            $set: {
                cart: {
                    products: [],
                    courses: []
                }
            },
            $push: {
                purchasedProducts: user.cart.products.map((product) => product.productID),
                purchasedCourses: user.cart.courses.map((course) => course.courseID)
            }
        });
        return {
            status: httpStatusCodes.OK,
            message: messageCenter.PAYMENTS.SUCCESS
        };
    }
}
module.exports = {
    Payment
};
