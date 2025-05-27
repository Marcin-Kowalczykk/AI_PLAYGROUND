export type DescriptionItem = { id: number; text: string }

export type DescriptionList<T = DescriptionItem> = T[]

export type DescriptionKey =
  | 'descriptionExample1'
  | 'descriptionExample2'
  | 'descriptionExample3'
  | 'descriptionExample4'
  | 'descriptionExample5'
  | 'descriptionExample6'
  | 'descriptionExample7'
  | 'descriptionExample8'
  | 'descriptionExample9'
  | 'descriptionExample10'
  | 'descriptionExample11'

export type Descriptions<T = DescriptionItem> = {
  [K in DescriptionKey]: DescriptionList<T>
}

export interface IDescriptionsResponse<T = DescriptionItem> {
  descriptions: Descriptions<T>
}
