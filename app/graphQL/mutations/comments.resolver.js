/* eslint-disable no-return-await */
/* eslint-disable import/no-extraneous-dependencies */
const { GraphQLString } = require('graphql');
const createHttpError = require('http-errors');
const { StatusCodes: httpStatusCodes } = require('http-status-codes');
const { isAuthenticatedForGraphQL } = require('../../http/middlewares/authorization');
const { ResponseType } = require('../typeDefs/publicTypes');
const { BlogModel } = require('../../model/blog');
const { messageCenter } = require('../../utilities/messages');
const { CommentsModel } = require('../../model/comments');
const { AnswersModel } = require('../../model/answer');
const { ProductModel } = require('../../model/product');
const { CourseModel } = require('../../model/courses');
const { checkExistContent } = require('../utils');

async function checkExistComment(id) {
    const comment = await CommentsModel.findOne({ _id: id });
    if (!comment) throw createHttpError.NotFound(messageCenter.COMMENTS.NOT_FOUND);
    return {
        comment
    };
}
async function authenticateUser(context) {
    const { req } = context;
    return await isAuthenticatedForGraphQL(req);
}

async function createComment(userId, Model, contentID, text) {
    const { content } = await checkExistContent(Model, contentID);
    const createdComment = await CommentsModel.create({
        user: userId,
        comment: text,
        source: contentID,
    });

    if (createdComment) {
        content.comments.push(createdComment.id);
        await content.save();
    }

    return createdComment;
}
async function createCommentAnswer(userId, parentCommentId, text) {
    return await AnswersModel.create({
        user: userId,
        answer: text,
        parentComment: parentCommentId,
    });
}
async function createReplyToComment(userId, parentCommentId, text) {
    const { comment } = await checkExistComment(parentCommentId);

    if (!comment.replyedOnce) {
        const commentAnswer = await createCommentAnswer(userId, parentCommentId, text);

        comment.replyedOnce = true;
        comment.answer = commentAnswer.id;
        await comment.save();

        return {
            status: messageCenter.public.success,
            message: messageCenter.COMMENTS.CREATED
        };
    }
    return createHttpError.BadRequest(messageCenter.COMMENTS.REPLAYED_ONCE);
}
function createHttpErrorFromError(error) {
    const statusCode = error.statusCode || httpStatusCodes.INTERNAL_SERVER_ERROR;
    return createHttpError[statusCode](error.message);
}

const CreateCommentsForBlogs = {
    type: ResponseType,
    args: {
        blogID: { type: GraphQLString },
        text: { type: GraphQLString },
        parentComment: { type: GraphQLString },
    },
    resolve: async (_, args, context) => {
        try {
            const user = await authenticateUser(context);
            const { blogID, text, parentComment } = args;

            if (!parentComment) {
                await createComment(user.id, BlogModel, blogID, text);
                return {
                    status: messageCenter.public.success,
                    message: messageCenter.COMMENTS.CREATED,
                };
            }
            return createReplyToComment(user.id, parentComment, text);
        } catch (error) {
            return createHttpErrorFromError(error);
        }
    },
};
const CreateCommentsForProducts = {
    type: ResponseType,
    args: {
        productID: { type: GraphQLString },
        text: { type: GraphQLString },
        parentComment: { type: GraphQLString },
    },
    resolve: async (_, args, context) => {
        try {
            const user = await authenticateUser(context);
            const { productID, text, parentComment } = args;

            if (!parentComment) {
                await createComment(user.id, ProductModel, productID, text);
                return {
                    status: messageCenter.public.success,
                    message: messageCenter.COMMENTS.CREATED,
                };
            }
            return createReplyToComment(user.id, parentComment, text);
        } catch (error) {
            return createHttpErrorFromError(error);
        }
    },
};
const CreateCommentsForCourses = {
    type: ResponseType,
    args: {
        courseID: { type: GraphQLString },
        text: { type: GraphQLString },
        parentComment: { type: GraphQLString },
    },
    resolve: async (_, args, context) => {
        try {
            const user = await authenticateUser(context);
            const { courseID, text, parentComment } = args;

            if (!parentComment) {
                await createComment(user.id, CourseModel, courseID, text);
                return {
                    status: messageCenter.public.success,
                    message: messageCenter.COMMENTS.CREATED,
                };
            }
            return createReplyToComment(user.id, parentComment, text);
        } catch (error) {
            return createHttpErrorFromError(error);
        }
    },
};

module.exports = {
    CreateCommentsForBlogs,
    CreateCommentsForCourses,
    CreateCommentsForProducts
};
