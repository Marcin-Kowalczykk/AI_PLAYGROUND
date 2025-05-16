export interface ITest {
  q: string
  a: string
}

export interface TestDataItem {
  question: string
  answer: number
  test?: ITest
}

export interface DefaultDataFromTxt {
  apikey: string
  description: string
  copyright: string
  'test-data': TestDataItem[]
}
