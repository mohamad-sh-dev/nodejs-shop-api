/* eslint-disable import/no-extraneous-dependencies */
const {
    GraphQLString, GraphQLObjectType, GraphQLInt,
} = require('graphql');

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
    name: 'CategoryType',
    fields: {
        _id: { type: GraphQLString },
        name: { type: GraphQLString }
    }

});

module.exports = {
    AuthorType,
    PublicCategoryType,
    SupplierType,
    PropertiesType,
    SubCategoryType
};
