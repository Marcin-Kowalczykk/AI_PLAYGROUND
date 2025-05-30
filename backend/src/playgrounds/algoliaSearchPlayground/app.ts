import {
  addOrUpdateAlgoliaObject,
  enableAlgoliaFacetingAttributes,
  isAlgoliaIndexExists,
  searchSingleAlgoliaIndex,
} from '../../middlewares/algoliaService/algoliaService'
import { v4 as uuidv4 } from 'uuid'

console.log('algoliaSearchPlayground-test')

const data = [
  {
    author: 'Adam',
    text: 'I believe in writing clean, maintainable code. Refactoring should be a regular part of our development process.',
  },
  {
    author: 'Adam',
    text: 'random text',
  },
  {
    author: 'Kuba',
    text: 'Test-driven development has significantly improved the quality of our codebase. Lets make it a standard practice.',
  },
  {
    author: 'Mateusz',
    text: 'Optimizing our CI/CD pipeline could greatly enhance our deployment efficiency. We should prioritize this in our next sprint.',
  },
]

const INDEX_NAME = 'dev_comments-test'

const main = async () => {
  const isIndexExists = await isAlgoliaIndexExists(INDEX_NAME)
  console.log('Does index exist? ', isIndexExists ? 'yes' : 'no')

  if (isIndexExists) console.log('Index name: ', INDEX_NAME)

  if (!isIndexExists) {
    console.log('Adding data to index...')
    for (const item of data) {
      const objectID = uuidv4()
      await addOrUpdateAlgoliaObject(INDEX_NAME, objectID, item)
    }
    console.log('Data added to index successfully!')
  } else {
    console.log('Index already exists. Skipping data addition.')
  }

  await enableAlgoliaFacetingAttributes(INDEX_NAME, ['author'])

  const QUERY = 'code'
  const searchResult = await searchSingleAlgoliaIndex(INDEX_NAME, QUERY, {
    queryParameters: {
      filters: 'author:Adam',
    },
  })

  console.table(
    searchResult.hits.map((hit: any) => ({
      Author: hit.author,
      Text: hit.text.slice(0, 45) + (hit.text.length > 45 ? '...' : ''),
      ObjectID: hit.objectID,
      MatchLevel: hit._highlightResult.text.matchLevel,
      MatchedWords: hit._highlightResult.text.matchedWords.join(', '),
      UserScore: hit._rankingInfo.userScore,
    })),
  )
}

main()
