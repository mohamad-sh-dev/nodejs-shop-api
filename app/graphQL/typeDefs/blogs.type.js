/* eslint-disable import/no-extraneous-dependencies */
const {
    GraphQLObjectType, GraphQLList, GraphQLString
} = require('graphql');
const {
 AuthorType, PublicCategoryType, CommentType, UserType
} = require('./publicTypes');

const BlogsType = new GraphQLObjectType({
    name: 'BlogsType',
    fields: {
        _id: { type: GraphQLString },
        likes: { type: new GraphQLList(UserType) },
        disLikes: { type: new GraphQLList(UserType) },
        bookmarks: { type: new GraphQLList(UserType) },
        title: { type: GraphQLString },
        summary: { type: GraphQLString },
        body: { type: GraphQLString },
        author: { type: AuthorType },
        image: { type: GraphQLString },
        tag: { type: new GraphQLList(GraphQLString) },
        category: { type: PublicCategoryType },
        comments: { type: new GraphQLList(CommentType) },
    }
});

module.exports = {
    BlogsType
};
