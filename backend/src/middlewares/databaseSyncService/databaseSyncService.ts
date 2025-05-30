import path from 'path'
import { sql } from 'drizzle-orm'
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'
import { BunSQLiteDatabase, drizzle } from 'drizzle-orm/bun-sqlite'
import { existsSync } from 'fs'
import {
  deleteAlgoliaObject,
  partialUpdateAlgoliaObject,
  saveAlgoliaObject,
} from '../algoliaService/algoliaService'
import {
  deletePointInQdrantCollection,
  updatePointInQdrantCollection,
  initializeAndSaveQdrantCollectionWithData,
} from '../qdrantVectorService/qdrantVectorService'
import { Database } from 'bun:sqlite'

type DbType = BunSQLiteDatabase<Record<string, never>> & {
  $client: Database
}

export const createDocumentsTable = (dbName: string) =>
  sqliteTable(dbName, {
    id: integer('id').primaryKey(),
    uuid: text('uuid').notNull().unique(),
    name: text('name').notNull(),
    content: text('content').notNull(),
    source: text('source').notNull(),
    indexed: integer('indexed').notNull(),
    conversation_uuid: text('conversation_uuid').notNull(),
    type: text('type').notNull(),
    description: text('description'),
    created_at: text('created_at').notNull(),
    updated_at: text('updated_at').notNull(),
  })

export function initializeDatabaseSyncService(dbPath: string = 'advanced_web_search/database.db') {
  const absolutePath = path.resolve(dbPath)
  console.log(`Using database at: ${absolutePath}`)

  const dbExists = existsSync(absolutePath)
  const sqlite = new Database(absolutePath)
  const db = drizzle(sqlite)

  if (!dbExists) {
    console.log('Database does not exist. Initializing...')
    initializeDatabase(db)
  } else {
    console.log('Database already exists. Checking for updates...')
    initializeDatabase(db)
  }
  return db
}

function initializeDatabase(db: DbType) {
  db.run(sql`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      content TEXT NOT NULL,
      source TEXT NOT NULL,
      indexed INTEGER NOT NULL DEFAULT 0,
      conversation_uuid TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  try {
    db.get(sql`SELECT uuid FROM documents LIMIT 1`)
    console.log('UUID column already exists')
  } catch {
    console.log('UUID column does not exist. Adding it now...')
    db.run(sql`ALTER TABLE documents ADD COLUMN uuid TEXT NOT NULL DEFAULT ''`)
  }

  db.run(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_documents_uuid ON documents(uuid);
  `)

  db.run(sql`
    CREATE VIRTUAL TABLE IF NOT EXISTS documents_search USING fts5(
      name, content, conversation_uuid, source, type, description,
      tokenize='porter unicode61'
    );
  `)

  db.run(sql`
    CREATE TRIGGER IF NOT EXISTS documents_ai AFTER INSERT ON documents BEGIN
      INSERT INTO documents_search(rowid, name, content, conversation_uuid, source, type, description)
      VALUES (new.id, new.name, new.content, new.conversation_uuid, new.source, new.type, new.description);
    END;
  `)

  db.run(sql`
    CREATE TRIGGER IF NOT EXISTS documents_ad AFTER DELETE ON documents BEGIN
      DELETE FROM documents_search WHERE rowid = old.id;
    END;
  `)

  db.run(sql`
    CREATE TRIGGER IF NOT EXISTS documents_au AFTER UPDATE ON documents BEGIN
      UPDATE documents_search
      SET name = new.name,
          content = new.content,
          conversation_uuid = new.conversation_uuid,
          source = new.source,
          type = new.type,
          description = new.description
      WHERE rowid = old.id;
    END;
  `)
}

export const insertDocument = async (
  db: DbType,
  dbName: string,
  document: {
    uuid: string
    name: string
    content: string
    source: string
    conversation_uuid: string
    type: string
    description?: string
    indexed?: boolean
  },
) => {
  const documents = createDocumentsTable(dbName)
  const { indexed = false, ...rest } = document
  console.log('Creating document...', document.uuid, document.name)
  console.log('Creating SQLite document...')
  const result = await db
    .insert(documents)
    .values({
      ...rest,
      uuid: document.uuid,
      indexed: indexed ? 1 : 0,
      created_at: sql`CURRENT_TIMESTAMP`,
      updated_at: sql`CURRENT_TIMESTAMP`,
    })
    .run()

  console.log('Creating Algolia document...')
  await saveAlgoliaObject('documents', {
    ...document,
    objectID: document.uuid,
  })

  console.log('Creating Qdrant document...')
  await initializeAndSaveQdrantCollectionWithData('documents', [
    {
      id: document.uuid,
      text: `${document.name}: ${document.content}`,
      metadata: { ...document, uuid: document.uuid },
    },
  ])

  return result
}

export const updateDocument = async (
  db: DbType,
  dbName: string,
  uuid: string,
  document: Partial<{
    name: string
    content: string
    source: string
    conversation_uuid: string
    type: string
    description?: string
    indexed: boolean
  }>,
) => {
  console.log('Updating document...', uuid, document.name)
  console.log('Updating SQLite document...')
  const documents = createDocumentsTable(dbName)
  const result = await db
    .update(documents)
    .set({
      ...document,
      updated_at: sql`CURRENT_TIMESTAMP`,
      indexed: document.indexed ? 1 : 0,
    })
    .where(sql`uuid = ${uuid}`)
    .run()

  console.log('Updating Algolia document...')
  await partialUpdateAlgoliaObject('documents', uuid, document)

  console.log('Updating Qdrant document...')
  const updatedDoc = await getDocumentByUuid(db, uuid, dbName)
  if (updatedDoc) {
    await updatePointInQdrantCollection('documents', {
      id: uuid,
      text: `${updatedDoc.name}: ${updatedDoc.content}`,
      metadata: updatedDoc,
    })
  }

  return result
}

export const deleteDocument = async (db: DbType, uuid: string, dbName: string) => {
  console.log('Deleting document...')
  console.log('Deleting SQLite document...')
  const documents = createDocumentsTable(dbName)
  const result = await db
    .delete(documents)
    .where(sql`uuid = ${uuid}`)
    .run()
  // Sync to Algolia
  console.log('Deleting Algolia document...')
  await deleteAlgoliaObject('documents', uuid)
  // Sync to Qdrant
  console.log('Deleting Qdrant document...')
  await deletePointInQdrantCollection('documents', uuid)

  return result
}

export const getDocumentByUuid = async (db: DbType, uuid: string, dbName: string) => {
  const documents = createDocumentsTable(dbName)

  return db
    .select()
    .from(documents)
    .where(sql`uuid = ${uuid}`)
    .get()
}

export const getAllDocuments = async (db: DbType, dbName: string) => {
  console.log('Fetching all documents')
  const documents = createDocumentsTable(dbName)
  const result = await db.select().from(documents).all()

  console.log(`Found ${result.length} documents`)
  return result
}
