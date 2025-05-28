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

export const createNewCollection = async (collectionName: string) => {
  const collections = await qdrantClient.getCollections()
  if (!collections.collections.some((collection) => collection.name === collectionName)) {
    await qdrantClient.createCollection(collectionName, {
      vectors: { size: 3072, distance: 'Cosine' },
    })
  }
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

export const savePointsToFile = async (collectionName: string, points: any) => {
  const dirPath = path.join(__dirname, collectionName)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
  }
  const pointsFilePath = path.join(dirPath, `points-${collectionName}.json`)
  fs.writeFileSync(pointsFilePath, JSON.stringify(points, null, 2))
}

export const initializeAndSaveQdrantCollectionWithData = async (
  collectionName: string,
  points: Array<{
    id?: string
    text: string
    metadata?: Record<string, any>
  }>,
) => {
  const collections = await qdrantClient.getCollections()
  if (!collections.collections.some((collection) => collection.name === collectionName)) {
    await createNewCollection(collectionName)
    const pointsToUpsert = await upsertNewPointsToQdrantCollectionByOpenAi(collectionName, points)
    await savePointsToFile(collectionName, pointsToUpsert)
  }
}

export const searchFromQdrantCollectionByOpenAi = async (
  collectionName: string,
  query: string,
  filter: Record<string, any> = {},
  limit: number = 5,
) => {
  const queryEmbedding = await createOpenAiEmbedding(query)
  return qdrantClient.search(collectionName, {
    vector: queryEmbedding,
    limit,
    with_payload: true,
    filter,
  })
}
