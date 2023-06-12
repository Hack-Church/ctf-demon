import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
  type Team {
    id: ID
    name: String
    solves: [Challenge]
  }

  type Challenge {
    id: ID
    name: String
    description: String
    flag: String
    solvedBy: [Team]
  }

  type Query {
    teams: [Team]
    challenges: [Challenge]
  }
`;

const teams = [
  {id: 1, name: 'Team 1'},
  {id: 2, name: 'Team 2'},
  {id: 3, name: 'Team 3'},
]

const challenges = [
  {id: 1, name: 'Challenge 1', description: 'This is an easy one', flag: '123456'},
  {id: 2, name: 'Challenge 2', description: 'Another one', flag: '987654'},
  {id: 3, name: 'Challenge 3', description: 'Too hard', flag: '666999'}
]

const solves = [
  { teamId: 1, challengeId: 1 },
  { teamId: 1, challengeId: 2 },
  { teamId: 2, challengeId: 2 }
]

const resolvers = {
  Query: {
    teams: () => teams,
    challenges: () => challenges,
  },
  Team: {
    solves: (parent) => {
      const parentSolves = solves.filter((solve) => solve.teamId == parent.id)
      const challengeIds = parentSolves.map((solve) => solve.challengeId)
      return challenges.filter((challenge) => challengeIds.includes(challenge.id))
    }
  },
  Challenge: {
    solvedBy: (parent) => {
      const parentSolves = solves.filter((solve) => solve.challengeId == parent.id)
      const teamIds = parentSolves.map((solve) => solve.teamId)
      return teams.filter((team) => teamIds.includes(team.id))
    }
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
