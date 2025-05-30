import 'dotenv/config'
import { QdrantClient } from '@qdrant/js-client-rest'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { createOpenAiEmbedding } from '../askOpenAI/createOpenAiEmbeddings'

export const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_API_URL,
  apiKey: process.env.QDRANT_API_KEY,
})

export const createNewQdrantCollection = async (collectionName: string) => {
  const collections = await qdrantClient.getCollections()
  if (!collections.collections.some((collection) => collection.name === collectionName)) {
    await qdrantClient.createCollection(collectionName, {
      vectors: { size: 3072, distance: 'Cosine' },
    })
  }
}

export const createPayloadIndex = async (collectionName: string, payloadIndexName: string) => {
  const payloadIndex = await qdrantClient.createPayloadIndex(collectionName, {
    field_name: payloadIndexName,
    field_schema: 'keyword',
  })

  return payloadIndex
}

export const upsertNewPointsToQdrantCollectionByOpenAi = async (
  collectionName: string,
  points: Array<{
    id?: string
    text: string
    metadata?: Record<string, any>
  }>,
) => {
  const pointsToUpsert = await Promise.all(
    points.map(async (point) => {
      const embedding = await createOpenAiEmbedding(point.text)

      return {
        id: point.id || uuidv4(),
        vector: embedding,
        payload: {
          text: point.text,
          ...point.metadata,
        },
      }
    }),
  )

  await qdrantClient.upsert(collectionName, {
    wait: true,
    points: pointsToUpsert,
  })

  return pointsToUpsert
}

export const updatePointInQdrantCollection = async (
  collectionName: string,
  point: {
    id: string
    text: string
    metadata?: Record<string, any>
  },
) => {
  await initializeAndSaveQdrantCollectionWithData(collectionName, [point])
}

export const deletePointInQdrantCollection = async (collectionName: string, pointId: string) => {
  await qdrantClient.delete(collectionName, {
    wait: true,
    points: [pointId],
  })
}

export const savePointsToFile = async (collectionName: string, points: any[]) => {
  const dirPath = path.join(__dirname, collectionName)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
  }
  const pointsFilePath = path.join(dirPath, `points-${collectionName}.json`)

  let existingPoints: any[] = []
  if (fs.existsSync(pointsFilePath)) {
    const fileContent = fs.readFileSync(pointsFilePath, 'utf-8')
    try {
      existingPoints = JSON.parse(fileContent)
      if (!Array.isArray(existingPoints)) {
        existingPoints = []
      }
    } catch {
      existingPoints = []
    }
  }

  const existingIds = new Set(existingPoints.map((p) => p.id))

  const newUniquePoints = points.filter((p) => !existingIds.has(p.id))

  const updatedPoints = [...existingPoints, ...newUniquePoints]
  fs.writeFileSync(pointsFilePath, JSON.stringify(updatedPoints, null, 2))
}

export const initializeAndSaveQdrantCollectionWithData = async (
  collectionName: string,
  points: Array<{
    id?: string
    text: string
    metadata?: Record<string, any>
  }>,
  payloadIndexName?: string,
) => {
  console.log('create new qdrant collection...')
  await createNewQdrantCollection(collectionName)
  if (payloadIndexName) {
    console.log('create qdrant payload index...')
    await createPayloadIndex(collectionName, payloadIndexName)
  }
  console.log('upsert new points to qdrant vector collection...')
  const pointsToUpsert = await upsertNewPointsToQdrantCollectionByOpenAi(collectionName, points)
  console.log('save points to file...')
  await savePointsToFile(collectionName, pointsToUpsert)
}

export const searchFromQdrantCollectionByOpenAi = async (
  collectionName: string,
  query: string,
  filter: Record<string, any> = {},
  limit: number = 5,
) => {
  console.log('search from qdrant collection...')
  console.log('query: ', query)
  const queryEmbedding = await createOpenAiEmbedding(query)
  return qdrantClient.search(collectionName, {
    vector: queryEmbedding,
    limit,
    with_payload: true,
    filter,
  })
}
