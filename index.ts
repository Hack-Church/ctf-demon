import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
  type Team {
    id: Int
    name: String
  }

  type Challenge {
    id: Int
    name: String
    description: String
    flag: String
  }

  type Solve {
    team: Team
    challenge: Challenge
  }

  type Query {
    teams: [Team]
    challenges: [Challenge]
    solves: [Solve]
  }
`;

const teams = [
  {id: 1, name: 'Team 1'},
  {id: 2, name: 'Team 2'},
  {id: 3, name: 'Team 3'},
]

const challenges = [
  {id: 1, name: 'Challenge 1', description: 'This is an easy one', flag: '123456'},
  {id: 2, name: 'Challenge 2', description: 'Another one', flag: '987654'}
]

const solves = [
  {team: teams[0], challenge: challenges[0]}
]

const resolvers = {
  Query: {
    teams: () => teams,
    challenges: () => challenges,
    solves: () => solves
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
