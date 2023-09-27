/* eslint-disable import/no-extraneous-dependencies */
const {
    GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt
} = require('graphql');
const { AuthorType, ChaptersType, CommentType } = require('./publicTypes');
const { CategoryType } = require('./category.types');

const CoursesType = new GraphQLObjectType({
    name: 'CoursesType',
    fields: {
        _id: { type: GraphQLString },
        title: { type: GraphQLString },
        summary: { type: GraphQLString },
        description: { type: GraphQLString },
        body: { type: GraphQLString },
        author: { type: AuthorType },
        image: { type: GraphQLString },
        type: { type: GraphQLString },
        duration: { type: GraphQLString },
        teacher: { type: AuthorType },
        tags: { type: new GraphQLList(GraphQLString) },
        comments: { type: new GraphQLList(CommentType) },
        category: { type: CategoryType },
        price: { type: GraphQLInt },
        discount: { type: GraphQLInt },
        chapters: { type: new GraphQLList(ChaptersType) }
    }
});

module.exports = {
    CoursesType
};
