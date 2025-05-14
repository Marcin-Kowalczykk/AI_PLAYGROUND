export type DescriptionExample = { id: number; text: string }[]

export interface IDescriptions {
  descriptionExample1: DescriptionExample
  descriptionExample2: DescriptionExample
}

export interface IDescriptionsResponse {
  descriptions: IDescriptions
}
