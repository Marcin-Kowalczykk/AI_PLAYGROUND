import { DEFAULT_FILE_URL } from '../constants'
import { TestDataItem } from '../model'
import { fetchDefaultDataFromTxt } from '../../helpers/fetchDefaultDataFromTxt'

export const getDefaultTestData = async (): Promise<TestDataItem[]> => {
  const data = await fetchDefaultDataFromTxt(DEFAULT_FILE_URL)

  console.log('Default-test-data: ', data['test-data'])
  return data['test-data']
}
