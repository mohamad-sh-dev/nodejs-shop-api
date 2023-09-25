/* eslint-disable no-return-await */
/* eslint-disable import/no-extraneous-dependencies */
const { GraphQLList, GraphQLString } = require('graphql');
const { ProductsType } = require('../typeDefs/products.types');
const { ProductModel } = require('../../model/product');

const ProductsResolver = {
    type: new GraphQLList(ProductsType),
    args: { category: { type: GraphQLString } },
    resolve: async (__, args) => {
        const { category } = args;
        const dbQuery = category ? { category } : {};
        return await ProductModel.find(dbQuery).populate('suplier category');
    }
};

module.exports = {
    ProductsResolver
};
