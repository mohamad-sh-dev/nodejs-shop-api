/* eslint-disable no-return-await */
/* eslint-disable import/no-extraneous-dependencies */
const { GraphQLList, GraphQLString } = require('graphql');
const { CoursesType } = require('../typeDefs/courses.type');
const { CourseModel } = require('../../model/courses');

const CourseResolver = {
    type: new GraphQLList(CoursesType),
    args: { category: { type: GraphQLString } },
    resolve: async (__, args) => {
        const { category } = args;
        const dbQuery = category ? { category } : {};
        await CourseModel.find(dbQuery)
            .populate('category').populate({
                path: 'chapters',
                populate: {
                    path: 'episodes',
                },
            });
    }
};

module.exports = {
    CourseResolver
};
