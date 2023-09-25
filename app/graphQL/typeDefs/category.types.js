/* eslint-disable import/no-extraneous-dependencies */
const {
    GraphQLObjectType, GraphQLString
} = require('graphql');
const { PublicCategoryType } = require('./publicTypes');

const CategoryType = new GraphQLObjectType({
    name: 'CategoryType',
    fields: {
        _id: { type: GraphQLString },
        name: { type: GraphQLString },
        subCatrgory: { type: PublicCategoryType }
    }
});

module.exports = {
    CategoryType
};
