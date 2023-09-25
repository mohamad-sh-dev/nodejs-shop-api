/* eslint-disable no-return-await */
/* eslint-disable import/no-extraneous-dependencies */
const { GraphQLList } = require('graphql');
const { ProductsType } = require('../typeDefs/products.types');
const { ProductModel } = require('../../model/product');

const ProductsResolver = {
    type: new GraphQLList(ProductsType),
    resolve: async () => await ProductModel.find().populate('suplier category')

};

module.exports = {
    ProductsResolver
};
