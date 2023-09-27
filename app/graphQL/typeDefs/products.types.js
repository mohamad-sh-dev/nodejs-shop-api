/* eslint-disable import/no-extraneous-dependencies */
const {
    GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt
} = require('graphql');
const {
    SupplierType, PropertiesType, PublicCategoryType, CommentType
} = require('./publicTypes');

const ProductsType = new GraphQLObjectType({
    name: 'ProductsType',
    fields: {
        _id: { type: GraphQLString },
        title: { type: GraphQLString },
        summary: { type: GraphQLString },
        description: { type: GraphQLString },
        imageCover: { type: GraphQLString },
        type: { type: GraphQLString },
        images: { type: new GraphQLList(GraphQLString) },
        tags: { type: new GraphQLList(GraphQLString) },
        category: { type: PublicCategoryType },
        price: { type: GraphQLInt },
        discount: { type: GraphQLInt },
        suplier: { type: SupplierType },
        comments: { type: new GraphQLList(CommentType) },
        properties: { type: PropertiesType },
    }
});

module.exports = {
    ProductsType
};
