/* eslint-disable import/no-extraneous-dependencies */
const {
    GraphQLString, GraphQLObjectType, GraphQLInt, GraphQLScalarType, GraphQLList,
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

const AnyType = new GraphQLScalarType({
    name: 'anyType',
    parseValue: toObject,
    serialize: toObject,
    parseLiteral,
});
module.exports = {
    AnyType,
    AuthorType,
    PublicCategoryType,
    SupplierType,
    PropertiesType,
    SubCategoryType,
    ChaptersType
};
