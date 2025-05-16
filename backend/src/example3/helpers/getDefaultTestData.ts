import { TestDataItem } from '../model'
import { fetchDefaultDataFromTxt } from './fetchDefaultDataFromTxt'

export const getDefaultTestData = async (): Promise<TestDataItem[]> => {
  const data = await fetchDefaultDataFromTxt()

  console.log('Default-test-data: ', data['test-data'])
  return data['test-data']
}
