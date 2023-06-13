import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('./ctf-demon.db')

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

const resolvers = {
  Query: {
    teams: () => new Promise((resolve, reject) => db.all(`SELECT * FROM teams`, [], (err,rows) => resolve(rows))),
    challenges: () => new Promise((resolve, reject) => db.all(`SELECT * FROM challenges`, [], (err,rows) => resolve(rows))),
  },
  Team: {
    solves: async (parent) => {
      const solvesQuery = `SELECT challengeId FROM solves WHERE teamId = ?`
      const solves = await new Promise<{challengeId:string}[]>((resolve, reject) => db.all(solvesQuery, [parent.id], (err, rows: {challengeId:string}[]) => resolve(rows)))
      const challengeIds = solves.map(item => item.challengeId)
      const challengeQuery = `SELECT * FROM challenges WHERE id IN (${challengeIds.map(() => '?')})`
      return await new Promise((resolve, reject) => db.all(challengeQuery, challengeIds, (err,rows) => resolve(rows)))
    }
  },
  Challenge: {
    solvedBy: async (parent) => {
      const solvesQuery = `SELECT teamId FROM solves WHERE challengeId = ?`
      const solves = await new Promise<{teamId:string}[]>((resolve, reject) => db.all(solvesQuery, [parent.id], (err, rows: {teamId:string}[]) => resolve(rows)))
      const teamIds = solves.map(item => item.teamId)
      const teamQuery = `SELECT * FROM teams WHERE id IN (${teamIds.map(() => '?')})`
      return await new Promise((resolve, reject) => db.all(teamQuery, teamIds, (err,rows) => resolve(rows)))
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
