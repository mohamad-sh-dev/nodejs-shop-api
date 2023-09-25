/* eslint-disable no-return-await */
/* eslint-disable import/no-extraneous-dependencies */
const { GraphQLList, GraphQLString } = require('graphql');
const { PublicCategoryType } = require('../typeDefs/publicTypes');
const { CategoryModel } = require('../../model/categories');
const { CategoryType } = require('../typeDefs/category.types');

const CategoryResolver = {
    type: new GraphQLList(CategoryType),
    resolve: async () => await CategoryModel.find({ parentCategory: null }).populate('subCategory')

};
const SubCategoryResolver = {
    type: new GraphQLList(PublicCategoryType),
    args: {
        parentID: { type: GraphQLString }
    },
    resolve: async (_, args) => {
        const { parentID } = args;
        return await CategoryModel.find({ parentCategory: parentID });
    }

};

module.exports = {
    SubCategoryResolver,
    CategoryResolver
};
