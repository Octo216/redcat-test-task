const { ApolloServer } = require('apollo-server');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require("apollo-server-core");

const resolvers = require('./graphql/resolvers')
const typeDefs = require('./graphql/schema')

const server = new ApolloServer({
  typeDefs, resolvers, plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
})

server
  .listen()
  .then(({ url }) => console.log(`Server is running on ${ url }`));
