/* eslint-disable import/no-extraneous-dependencies */
const {
    GraphQLObjectType, GraphQLSchema,
} = require('graphql');
const { BlogResolver } = require('./queries/blogs.resolver');
const { ProductsResolver } = require('./queries/products.resolver');
const { CategoryResolver, SubCategoryResolver } = require('./queries/category.resolver');

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        blogs: BlogResolver,
        products: ProductsResolver,
        category: CategoryResolver,
        subCategory: SubCategoryResolver
    }
});
// const RootMutations = new GraphQLObjectType({
//     name: 'RootMutaions',
//     fields: {}
// });

const graphQLSchema = new GraphQLSchema({
    query: RootQuery,
    // mutation: RootMutations
});

module.exports = {
    graphQLSchema
};
