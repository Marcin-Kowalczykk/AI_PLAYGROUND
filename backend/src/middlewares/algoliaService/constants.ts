import { RemoveWordsIfNoResults } from 'algoliasearch'

import { QueryType } from 'algoliasearch'

export const DEFAULT_PARAMS = {
  hitsPerPage: 20,
  page: 0,
  attributesToRetrieve: ['*'],
  typoTolerance: true,
  ignorePlurals: true,
  removeStopWords: true,
  queryType: 'prefixNone' as QueryType,
  attributesToHighlight: ['*'],
  highlightPreTag: '<em>',
  highlightPostTag: '</em>',
  analytics: true,
  clickAnalytics: true,
  enablePersonalization: false,
  distinct: 1,
  facets: ['*'],
  minWordSizefor1Typo: 1,
  minWordSizefor2Typos: 3,
  advancedSyntax: true,
  removeWordsIfNoResults: 'lastWords' as RemoveWordsIfNoResults,
}
