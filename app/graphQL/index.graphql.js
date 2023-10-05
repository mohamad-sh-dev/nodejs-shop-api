/* eslint-disable import/no-extraneous-dependencies */
const {
    GraphQLObjectType, GraphQLSchema,
} = require('graphql');
const { BlogResolver } = require('./queries/blogs.resolver');
const { ProductsResolver } = require('./queries/products.resolver');
const { CategoryResolver, SubCategoryResolver } = require('./queries/category.resolver');
const { CourseResolver } = require('./queries/courses.resolver');
const { CreateCommentsForBlogs, CreateCommentsForCourses, CreateCommentsForProducts } = require('./mutations/comments.resolver');
const { BlogsLikesResolver, ProductLikesResolver, CoursesLikesResolver } = require('./mutations/likes.resolver');
const { BlogsDisLikesResolver, ProductDisLikesResolver, CoursesDisLikesResolver } = require('./mutations/disLikes.resolver');
const { BlogsBookmarksResolver, ProductBookmarksResolver, CoursesBookmarksResolver } = require('./mutations/bookmarks.resolver');
const {
    addProductToUserCart, removeProductFromUserCart, addCourseToUserCart, removeCourseFromUserCart, getUserCart
} = require('./mutations/userCart.resolver');
const { GetUserBookmarkedBlogs, GetUserBookmarkedProducts, GetUserBookmarkedCourses } = require('./queries/userBookmarks.resolver');

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        blogs: BlogResolver,
        products: ProductsResolver,
        category: CategoryResolver,
        subCategory: SubCategoryResolver,
        courses: CourseResolver,
        userBookmarkedBlogs: GetUserBookmarkedBlogs,
        userBookmarkedProducts: GetUserBookmarkedProducts,
        userBookmarkedCourses: GetUserBookmarkedCourses
    }
});
const RootMutations = new GraphQLObjectType({
    name: 'RootMutaions',
    fields: {
        CreateCommentsForBlogs,
        CreateCommentsForProducts,
        CreateCommentsForCourses,
        BlogsLikesResolver,
        CoursesLikesResolver,
        ProductLikesResolver,
        BlogsDisLikesResolver,
        ProductDisLikesResolver,
        CoursesDisLikesResolver,
        ProductBookmarksResolver,
        BlogsBookmarksResolver,
        bookmarkCourse: CoursesBookmarksResolver,
        bookmarkProduct: ProductBookmarksResolver,
        bookmarkBlog: BlogsBookmarksResolver,
        addProductToUserCart,
        removeProductFromUserCart,
        addCourseToUserCart,
        removeCourseFromUserCart,
        getUserCart
    }
});

const graphQLSchema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutations
});

module.exports = {
    graphQLSchema
};
