/* eslint-disable import/no-extraneous-dependencies */
const {
    GraphQLObjectType, GraphQLString, GraphQLList
} = require('graphql');
const { AnyType } = require('./publicTypes');

const CategoryType = new GraphQLObjectType({
    name: 'CategoryType',
    fields: {
        _id: { type: GraphQLString },
        name: { type: GraphQLString },
        subCategory: { type: new GraphQLList(AnyType) }
    }
});

module.exports = {
    CategoryType
};
