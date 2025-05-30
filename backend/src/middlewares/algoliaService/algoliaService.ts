import { searchClient } from '@algolia/client-search'
import 'dotenv/config'
import { DEFAULT_PARAMS } from './constants'

export const algoliaClient = searchClient(
  String(process.env.ALGOLIA_APPLICATION_ID),
  String(process.env.ALGOLIA_API_KEY_WRITE),
)

export const getAlgoliaIndices = async () => {
  return algoliaClient.listIndices()
}

export const isAlgoliaIndexExists = async (indexName: string) => {
  const allIndices = await getAlgoliaIndices()
  return allIndices.items.some((index) => index.name === indexName)
}

export const saveAlgoliaObject = async (indexName: string, object: Record<string, any>) => {
  return algoliaClient.saveObject({ indexName, body: object })
}

export const addOrUpdateAlgoliaObject = async (
  indexName: string,
  objectID: string,
  object: Record<string, any>,
) => {
  return algoliaClient.addOrUpdateObject({ indexName, objectID, body: object })
}

export const partialUpdateAlgoliaObject = async (
  indexName: string,
  objectID: string,
  attributes: Record<string, any>,
) => {
  return algoliaClient.partialUpdateObject({ indexName, objectID, attributesToUpdate: attributes })
}

export const deleteAlgoliaObject = async (indexName: string, objectID: string) => {
  return algoliaClient.deleteObject({ indexName, objectID })
}

export const deleteAlgoliaObjectByParams = async (indexName: string, filters: string) => {
  return algoliaClient.deleteBy({ indexName, deleteByParams: { filters } })
}

export const clearAlgoliaObjects = async (indexName: string) => {
  return algoliaClient.clearObjects({ indexName })
}

export const getAlgoliaObject = async (
  indexName: string,
  objectID: string,
  attributesToRetrieve?: string[],
) => {
  return algoliaClient.getObject({ indexName, objectID, attributesToRetrieve })
}

export const getAlgoliaObjects = async (
  requests: Array<{ indexName: string; objectID: string; attributesToRetrieve?: string[] }>,
) => {
  return algoliaClient.getObjects({ requests })
}

export const enableAlgoliaFacetingAttributes = async (
  indexName: string,
  filterAttributes: string[],
) => {
  await algoliaClient.setSettings({
    indexName,
    indexSettings: {
      attributesForFaceting: filterAttributes,
    },
  })
}

// if u use queryParameters: { filters } you need to enable faceting attributes first (fcn above)
export const searchSingleAlgoliaIndex = async (
  indexName: string,
  query: string = '',
  options?: { queryParameters?: Record<string, any>; headers?: Record<string, string> },
) => {
  const params = {
    ...DEFAULT_PARAMS,
    query,
    ...options?.queryParameters,
    getRankingInfo: true,
  }

  const searchResponse = await algoliaClient.search(
    [
      {
        indexName,
        params,
      },
    ],
    { headers: options?.headers },
  )

  return { searchResponse, hits: (searchResponse.results[0] as any).hits || [] }
}
