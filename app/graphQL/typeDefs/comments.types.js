/* eslint-disable import/no-extraneous-dependencies */
const {
    GraphQLObjectType, GraphQLList, GraphQLString, GraphQLBoolean
} = require('graphql');
const { AwnsersType } = require('./publicTypes');

const CommentsType = new GraphQLObjectType({
    name: 'CommentsType',
    fields: {
        _id: { type: GraphQLString },
        user: { type: GraphQLString },
        comment: { type: GraphQLString },
        source: { type: GraphQLString },
        replyedOnce: { type: GraphQLBoolean, default: false },
        awnsers: { type: new GraphQLList(AwnsersType) },
    }
});

module.exports = {
    CommentsType
};
