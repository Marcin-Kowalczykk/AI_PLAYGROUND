import { LangfuseGenerationClient, LangfuseSpanClient, LangfuseTraceClient } from 'langfuse'
import { langfuseConfig } from './langFuseConfig'
import { ChatCompletion, ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { ImagesResponse } from 'openai/resources/images'
import { CompletionUsage } from 'openai/resources/completions'

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
  output: ChatCompletion | ImagesResponse,
): void => {
  span.update({
    name,
    output:
      'choices' in output
        ? JSON.stringify(output.choices[0].message)
        : 'data' in output && output.data && output.data[0]
          ? JSON.stringify(output.data[0].url)
          : '',
  })

  const generation: LangfuseGenerationClient = span.generation({
    name,
    model: 'model' in output ? output.model : undefined,
    modelParameters: {},
    input: input,
    output: output,
    usage: {
      promptTokens:
        'prompt_tokens' in (output.usage ?? {})
          ? (output.usage as CompletionUsage).prompt_tokens
          : undefined,
      completionTokens:
        'completion_tokens' in (output.usage ?? {})
          ? (output.usage as CompletionUsage).completion_tokens
          : undefined,
      totalTokens:
        'total_tokens' in (output.usage ?? {})
          ? (output.usage as CompletionUsage).total_tokens
          : undefined,
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
