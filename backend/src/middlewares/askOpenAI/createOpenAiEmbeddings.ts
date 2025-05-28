import { openAiConfig } from './openAiConfig'

export const createOpenAiEmbedding = async (inputText: string): Promise<number[]> => {
  try {
    const response = await openAiConfig.embeddings.create({
      model: 'text-embedding-3-large',
      input: inputText,
    })

    return response.data[0].embedding
  } catch (error) {
    console.error('Error getting OpenAI embedding:', error)
    throw new Error(
      `Failed to get embedding from OpenAI: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
