import neo4j, { Driver } from 'neo4j-driver'
import { readJsonFile } from './app'
import 'dotenv/config'

const getBoltUrl = (url: string) => {
  if (url.startsWith('http://')) {
    return url.replace('http://', 'bolt://')
  }
  if (url.startsWith('https://')) {
    return url.replace('https://', 'bolt://')
  }
  return url
}

//uncomment depending on the environment
const NEO4J_URI = getBoltUrl(process.env.NEO4J_URL as string)
const NEO4J_USER = process.env.NEO4J_USER as string
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD as string
//local
// const NEO4J_URI = getBoltUrl(process.env.NEO4J_URL_LOCAL as string)
// const NEO4J_USER = process.env.NEO4J_USER_LOCAL as string
// const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD_LOCAL as string

export class Neo4jService {
  private driver: Driver

  constructor() {
    console.log('Connecting to Neo4j at:', NEO4J_URI)
    this.driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD))
  }

  async close() {
    await this.driver.close()
  }

  async clearDatabase() {
    const session = this.driver.session()
    try {
      await session.run('MATCH (n) DETACH DELETE n')
      console.log('Database cleared')
    } finally {
      await session.close()
    }
  }

  async createUsers(users: any[]) {
    const session = this.driver.session()
    try {
      const result = await session.run(
        `
        UNWIND $users as user
        CREATE (u:User {
          userId: user.user_id,
          username: user.username,
          accessLevel: user.access_level,
          isActive: user.is_active,
          lastLog: user.lastlog
        })
        `,
        { users },
      )
      console.log(`Created ${result.summary.counters.updates().nodesCreated} users`)
    } finally {
      await session.close()
    }
  }

  async createConnections(connections: any[]) {
    const session = this.driver.session()
    try {
      const result = await session.run(
        `
        UNWIND $connections as conn
        MATCH (u1:User {userId: conn.user1_id})
        MATCH (u2:User {userId: conn.user2_id})
        CREATE (u1)-[:KNOWS]->(u2)
        `,
        { connections },
      )
      console.log(`Created ${result.summary.counters.updates().relationshipsCreated} connections`)
    } finally {
      await session.close()
    }
  }

  async findShortestPath(fromUsername: string, toUsername: string): Promise<string> {
    const session = this.driver.session()
    try {
      const result = await session.run(
        `
        MATCH (start:User {username: $fromUsername}), (end:User {username: $toUsername})
        MATCH path = shortestPath((start)-[:KNOWS*]-(end))
        RETURN [node IN nodes(path) | node.username] AS path
        `,
        { fromUsername, toUsername },
      )

      if (result.records.length === 0) {
        return 'No path found'
      }

      const path = result.records[0].get('path')
      return path.join(',')
    } finally {
      await session.close()
    }
  }
}

// Example usage
export const initializeNeo4j = async () => {
  const neo4jService = new Neo4jService()

  try {
    // Clear existing data
    await neo4jService.clearDatabase()

    // Load data from files
    const users = readJsonFile('users.json')
    const connections = readJsonFile('connections.json')

    // Create users and connections
    await neo4jService.createUsers(users)
    await neo4jService.createConnections(connections)

    // Find shortest path
    const path = await neo4jService.findShortestPath('Rafał', 'Barbara')
    console.log('Shortest path:', path)

    return path
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await neo4jService.close()
  }
}
