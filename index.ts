import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
  type Team {
    id: Int
    name: String
  }

  type Query {
    teams: [Team]
  }
`;

const teams = [
  {id: 1, name: 'Team 1'},
  {id: 2, name: 'Team 2'},
  {id: 3, name: 'Team 3'},
]

const resolvers = {
  Query: {
    teams: () => teams,
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

const {url} = await startStandaloneServer(server, {
  listen: { port: 4000 }
})

console.log(`🚀  Server ready at: ${url}`);
