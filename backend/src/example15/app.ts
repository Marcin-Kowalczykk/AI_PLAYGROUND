import { sendDbQuery } from '../middlewares/sendDbQueryapidb'
import * as fs from 'fs'
import * as path from 'path'
import { initializeNeo4j } from './neo4jService'
import { sendAnswerToCentralApi } from '../middlewares/sendAnswerToCentralApi/sendAnswerToCentralApi'

const USER_FILE_NAME = 'users.json'
const CONNECTIONS_FILE_NAME = 'connections.json'

const renameIdToUserId = (users: any[]) => {
  return users.map((user) => {
    const { id, ...rest } = user

    return { user_id: id, ...rest }
  })
}

const saveArrayToFile = (data: any, filename: string) => {
  const filePath = path.join(__dirname, filename)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  console.log(`Data saved to ${filename}`)
}

const fileExists = (filename: string): boolean => {
  const filePath = path.join(__dirname, filename)
  return fs.existsSync(filePath)
}

export const readJsonFile = (filename: string): any => {
  const filePath = path.join(__dirname, filename)
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(fileContent)
}

const extractAndSaveArraysFromDbTable = async () => {
  const usersFileExists = fileExists(USER_FILE_NAME)
  const connectionsFileExists = fileExists(CONNECTIONS_FILE_NAME)

  let users, connections

  if (!usersFileExists || !connectionsFileExists) {
    console.log('Fetching data from database...')
    const usersFromDbTable = await sendDbQuery('SELECT * FROM users;', 'database')
    const connectionsFromDbTable = await sendDbQuery('SELECT * FROM connections;', 'database')

    users = renameIdToUserId(usersFromDbTable.reply)
    connections = connectionsFromDbTable.reply

    if (!usersFileExists) {
      saveArrayToFile(users, USER_FILE_NAME)
    }
    if (!connectionsFileExists) {
      saveArrayToFile(connections, CONNECTIONS_FILE_NAME)
    }
  } else {
    console.log('Reading data from files...')
    users = readJsonFile(USER_FILE_NAME)
    connections = readJsonFile(CONNECTIONS_FILE_NAME)
  }

  return {
    users,
    connections,
  }
}

export const handleProcessExample15 = async () => {
  const { users, connections } = await extractAndSaveArraysFromDbTable()

  console.log('USERS:', users)
  console.log('CONNECTIONS:', connections)

  const shortestPath = await initializeNeo4j()

  const responseFromCentrala = await sendAnswerToCentralApi({
    taskName: 'connections',
    answer: shortestPath,
  })

  console.log('ANSWER:', responseFromCentrala?.message)
}

handleProcessExample15()
