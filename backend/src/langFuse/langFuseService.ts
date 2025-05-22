import { LangfuseGenerationClient, LangfuseSpanClient, LangfuseTraceClient } from 'langfuse'
import { langfuseConfig } from './langFuseConfig'
import { ChatCompletion, ChatCompletionMessageParam } from 'openai/resources/chat/completions'

export const handleLangfuseError = () => {
  langfuseConfig.on('error', (error: Error) => {
    console.error('Langfuse error:', error)
  })
}

export const createLangfuseTrace = (
  name: string,
  id: string,
  sessionId: string,
): LangfuseTraceClient =>
  langfuseConfig.trace({
    id,
    name,
    sessionId,
  })

export const createLangfuseSpan = (
  trace: LangfuseTraceClient,
  name: string,
  input?: unknown,
): LangfuseSpanClient => {
  return trace.span({
    name,
    input: input ? JSON.stringify(input) : undefined,
  })
}

export const finalizeLangfuseSpan = (
  span: LangfuseSpanClient,
  name: string,
  input: ChatCompletionMessageParam[],
  output: ChatCompletion,
): void => {
  span.update({
    name,
    output: JSON.stringify(output.choices[0].message),
  })

  const generation: LangfuseGenerationClient = span.generation({
    name,
    model: output.model,
    modelParameters: {},
    input: input,
    output: output,
    usage: {
      promptTokens: output.usage?.prompt_tokens,
      completionTokens: output.usage?.completion_tokens,
      totalTokens: output.usage?.total_tokens,
    },
  })
  generation.end()
  span.end()
}

export const finalizeLangfuseTrace = async (
  trace: LangfuseTraceClient,
  originalMessages?: ChatCompletionMessageParam[],
  generatedMessages?: ChatCompletionMessageParam[],
): Promise<void> => {
  const inputMessages = originalMessages?.filter((msg) => msg.role !== 'system')

  if (originalMessages && generatedMessages) {
    trace.update({
      input: JSON.stringify(inputMessages),
      output: JSON.stringify(generatedMessages),
    })
  }

  await langfuseConfig.flushAsync()
}
