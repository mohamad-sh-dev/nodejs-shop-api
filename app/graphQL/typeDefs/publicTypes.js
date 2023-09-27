/* eslint-disable import/no-extraneous-dependencies */
const {
    GraphQLString, GraphQLObjectType, GraphQLInt, GraphQLScalarType, GraphQLList, GraphQLBoolean,
} = require('graphql');
const { toObject, parseLiteral } = require('../utils');

const AuthorType = new GraphQLObjectType({
    name: 'AuthorType',
    fields: {
        _id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
    }

});
const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: {
        _id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
    }

});
const SupplierType = new GraphQLObjectType({
    name: 'SupplierType',
    fields: {
        _id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
    }

});
const PropertiesType = new GraphQLObjectType({
    name: 'PropertiesType',
    fields: {
        length: { type: GraphQLInt },
        height: { type: GraphQLInt },
        width: { type: GraphQLInt },
        weight: { type: GraphQLInt },
        colors: { type: GraphQLString },
        model: { type: GraphQLString },
        madein: { type: GraphQLString },
    }

});
const SubCategoryType = new GraphQLObjectType({
    name: 'SubCategoryType',
    fields: {
        _id: { type: GraphQLString },
        name: { type: GraphQLString },
    }

});
const PublicCategoryType = new GraphQLObjectType({
    name: 'PublicCategoryType',
    fields: {
        _id: { type: GraphQLString },
        name: { type: GraphQLString },
    }

});
const EpisodesType = new GraphQLObjectType({
    name: 'EpisodesType',
    fields: {
        _id: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        chapterId: { type: GraphQLString },
        duration: { type: GraphQLString },
        address: { type: GraphQLString },
    }
});
const ChaptersType = new GraphQLObjectType({
    name: 'ChaptersType',
    fields: {
        _id: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        courseId: { type: GraphQLString },
        duration: { type: GraphQLString },
        episodes: { type: new GraphQLList(EpisodesType) },
    }

});
const AnswersType = new GraphQLObjectType({
    name: 'AnswersType',
    fields: {
        _id: { type: GraphQLString },
        user: { type: UserType },
        answer: { type: GraphQLString },
        parentComment: { type: GraphQLString },
    }

});
const CommentType = new GraphQLObjectType({
    name: 'CommentType',
    fields: {
        _id: { type: GraphQLString },
        user: { type: UserType },
        answer: { type: AnswersType },
        comment: { type: GraphQLString },
        replyedOnce: { type: GraphQLBoolean },
    }

});
const AnyType = new GraphQLScalarType({
    name: 'anyType',
    parseValue: toObject,
    serialize: toObject,
    parseLiteral,
});
const ResponseType = new GraphQLObjectType({
    name: 'ResponseType',
    fields: {
        status: { type: GraphQLString },
        message: { type: GraphQLString },
    }
});

module.exports = {
    UserType,
    AnswersType,
    CommentType,
    ResponseType,
    AnyType,
    AuthorType,
    PublicCategoryType,
    SupplierType,
    PropertiesType,
    SubCategoryType,
    ChaptersType
};
