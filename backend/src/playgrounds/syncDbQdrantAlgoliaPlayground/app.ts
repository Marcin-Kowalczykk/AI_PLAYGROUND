import path from 'path'
import {
  getAllDocuments,
  initializeDatabaseSyncService,
  insertDocument,
  updateDocument,
} from '../../middlewares/databaseSyncService/databaseSyncService'
import { v4 as uuidv4 } from 'uuid'
// import { searchFromQdrantCollectionByOpenAi } from '../../middlewares/qdrantVectorService/qdrantVectorService'

const talebBooks = [
  {
    title: 'The Black Swan',
    description:
      'An exploration of rare and unpredictable events, and their massive impact on society and history.',
    author: 'Nassim Nicholas Taleb',
  },
  {
    title: 'Antifragile',
    description:
      'A book about things that gain from disorder and how to thrive in an uncertain world.',
    author: 'Nassim Nicholas Taleb',
  },
  {
    title: 'Fooled by Randomness',
    description: 'An examination of the underestimated role of chance in life and in the markets.',
    author: 'Nassim Nicholas Taleb',
  },
  {
    title: 'Skin in the Game',
    description:
      'A book about risk and responsibility, and the importance of having a personal stake in decisions and actions.',
    author: 'Nassim Nicholas Taleb',
  },
  {
    title: 'The Bed of Procrustes',
    description:
      'A collection of philosophical and practical aphorisms that challenge our ideas about knowledge and uncertainty.',
    author: 'Nassim Nicholas Taleb',
  },
]

const DB_NAME = 'documents'

const syncDbQdrantAlgolia = async () => {
  const dbPath = path.resolve(__dirname, 'syncTest.db')
  const db = initializeDatabaseSyncService(dbPath)

  const docs = await getAllDocuments(db, DB_NAME)

  if (docs.length === 0) {
    for (const book of talebBooks) {
      const document = {
        uuid: uuidv4(),
        name: book.title,
        content: book.description,
        source: 'initialization',
        conversation_uuid: uuidv4(),
        type: 'book',
        description: `A book by ${book.author}`,
        indexed: true,
      }

      await insertDocument(db, DB_NAME, document)
    }
  }
}

const updateTable = async () => {
  const dbPath = path.resolve(__dirname, 'syncTest.db')
  const db = initializeDatabaseSyncService(dbPath)

  const docs = await getAllDocuments(db, DB_NAME)

  const documentToUpdate = {
    title: 'The Spy Who Loved Me',
    description: 'A book about a spy who loved a woman and how he saved the world.',
    author: 'Ian Fleming',
  }

  const { indexed, ...rest } = docs[0]
  const document = {
    ...rest,
    description: `A book by ${documentToUpdate.author}`,
    name: documentToUpdate.title,
    content: documentToUpdate.description,
    indexed: Boolean(indexed),
  }

  await updateDocument(db, DB_NAME, docs[0].uuid, document)
}

// syncDbQdrantAlgolia()
updateTable()
