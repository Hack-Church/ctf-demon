// Seed the database
import sqlite3 from 'sqlite3'

// Initialize
const db = new sqlite3.Database('./ctf-demon.db')

// TEAMS
db.run(`
  CREATE TABLE IF NOT EXISTS teams (
    id integer PRIMARY KEY,
    name text
  )
`)

const teamQuery = `INSERT INTO teams (id, name) VALUES (?, ?)`

const initialTeams = [
  { id: 1, name: 'Team 1'},
  { id: 2, name: 'Team 2'},
  { id: 3, name: 'Team 3'}
]

db.serialize(() => {
  const statement = db.prepare(teamQuery)

  initialTeams.forEach(row => {
    statement.run(row.id, row.name)
  })

  statement.finalize()
})

// CHALLENGES
db.run(`
  CREATE TABLE IF NOT EXISTS challenges (
    id integer PRIMARY KEY,
    name text,
    description text,
    flag text,
    points int
  )
`)

const challengeQuery = `INSERT INTO challenges (id, name, description, flag, points) VALUES (?, ?, ?, ?, ?)`

const initialChallenges = [
  { id: 1, name: 'Challenge 1', description: 'Easy', flag: '123456', points: 5},
  { id: 2, name: 'Challenge 2', description: 'Medium', flag: '987654', points: 10},
  { id: 3, name: 'Challenge 2', description: 'Hard', flag: '666999', points: 20},
]

db.serialize(() => {
  const statement = db.prepare(challengeQuery)

  initialChallenges.forEach(row => {
    statement.run(row.id, row.name, row.description, row.flag, row.points)
  })

  statement.finalize()
})

// SOLVES
db.run(`
  CREATE TABLE IF NOT EXISTS solves (
    teamId integer,
    challengeId integer 
  )
`)

const solvesQuery = `INSERT INTO solves (teamId, challengeId) VALUES (?, ?)`

const initialSolves = [
  { teamId: 1, challengeId: 1},
  { teamId: 1, challengeId: 2},
  { teamId: 2, challengeId: 2},
]

db.serialize(() => {
  const statement = db.prepare(solvesQuery)

  initialSolves.forEach(row => {
    statement.run(row.teamId, row.challengeId)
  })

  statement.finalize()
})

// Cleanup
db.close()
console.log('Finished seeding \'ctf-demon.db\'!')
