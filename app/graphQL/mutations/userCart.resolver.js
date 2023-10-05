/* eslint-disable no-return-await */
/* eslint-disable arrow-body-style */
const { GraphQLString } = require('graphql');
const createHttpError = require('http-errors');
const { isAuthenticatedForGraphQL } = require('../../http/middlewares/authorization');
const { UserModel } = require('../../model/user');
const { AnyType } = require('../typeDefs/publicTypes');
const { messageCenter } = require('../../utilities/messages');
const { createHttpErrorFromError } = require('../utils');

const addProductToUserCart = {
    type: AnyType,
    args: {
        productID: {
            type: GraphQLString
        }
    },
    resolve: async (_, args, context) => {
        const { req } = context;
        const { productID } = args;
        const user = await isAuthenticatedForGraphQL(req);
        const userDetails = await UserModel.findById(user.id);
        await userDetails.addProductToUserCart(productID);
        return {
            status: messageCenter.public.success,
            message: messageCenter.USER_CART.ADD_TO_CART
        };
    }
};
const addCourseToUserCart = {
    type: AnyType,
    args: {
        courseID: {
            type: GraphQLString
        }
    },
    resolve: async (_, args, context) => {
        const { req } = context;
        const { courseID } = args;
        const user = await isAuthenticatedForGraphQL(req);
        const userDetails = await UserModel.findById(user.id);
        if (userDetails.purchasedCourses.includes(courseID)) throw createHttpError.BadRequest(messageCenter.COURSES.COURSE_ALREADY_BUYED);
        await userDetails.addCourseToUserCart(courseID);
        return {
            status: messageCenter.public.success,
            message: messageCenter.USER_CART.ADD_TO_CART
        };
    }
};
const removeProductFromUserCart = {
    type: AnyType,
    args: {
        productID: {
            type: GraphQLString
        }
    },
    resolve: async (_, args, context) => {
        try {
            const { req } = context;
            const { productID } = args;
            const user = await isAuthenticatedForGraphQL(req);
            const userDetails = await UserModel.findById(user.id);
            await userDetails.removeProductFromUserCart(productID);
            return {
                status: messageCenter.public.success,
                message: messageCenter.USER_CART.REMOVE_FROM_CART
            };
        } catch (error) {
            return createHttpErrorFromError(error);
        }
    }
};
const removeCourseFromUserCart = {
    type: AnyType,
    args: {
        courseID: {
            type: GraphQLString
        }
    },
    resolve: async (_, args, context) => {
        const { req } = context;
        const { courseID } = args;
        const user = await isAuthenticatedForGraphQL(req);
        const userDetails = await UserModel.findById(user.id);
        await userDetails.removeCourseFromUserCart(courseID);
        return {
            status: messageCenter.public.success,
            message: messageCenter.USER_CART.REMOVE_FROM_CART
        };
    }
};

const getUserCart = {
    type: AnyType,
    resolve: async (_, args, context) => {
        try {
            const { req } = context;
            const user = await isAuthenticatedForGraphQL(req);
            const userDetails = await UserModel.findById(user.id);
            return await userDetails.calculateUserCart();
        } catch (error) {
            return createHttpErrorFromError(error);
        }
    }
};

module.exports = {
    addProductToUserCart,
    addCourseToUserCart,
    removeProductFromUserCart,
    removeCourseFromUserCart,
    getUserCart
};
