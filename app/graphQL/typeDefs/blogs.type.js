/* eslint-disable import/no-extraneous-dependencies */
const {
    GraphQLObjectType, GraphQLList, GraphQLString
} = require('graphql');
const { AuthorType, PublicCategoryType } = require('./publicTypes');

const BlogsType = new GraphQLObjectType({
    name: 'BlogsType',
    fields: {
        _id: { type: GraphQLString },
        title: { type: GraphQLString },
        summary: { type: GraphQLString },
        body: { type: GraphQLString },
        author: { type: AuthorType },
        image: { type: GraphQLString },
        tag: { type: new GraphQLList(GraphQLString) },
        category: { type: PublicCategoryType },

    }
});

module.exports = {
    BlogsType
};
