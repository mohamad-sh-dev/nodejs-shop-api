const { graphQLSchema } = require('../graphQL/index.graphql');

function graphQlConfig(req, res) {
    return {
        schema: graphQLSchema,
        context: (req, res),
        graphiql: true

    };
}

module.exports = {
    graphQlConfig
};
