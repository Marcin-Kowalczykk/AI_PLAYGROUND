import OpenAI from "openai";
import { systemMsgExample2 } from "./systemMsgExample2";
import { Message } from "./model";

export const getAnswerFromOpenAiExample2 = async (openaiConfig: OpenAI, messages: Message[]): Promise<string> => {
    const updatedMessages: Message[] = [
        { role: "system", content: systemMsgExample2 },
        ...messages,
    ];

    console.log('History (local) messages to open AI: ', updatedMessages)
  
    const response = await openaiConfig.chat.completions.create({
        model: "gpt-4",
        messages: updatedMessages,
    });

    const responseData = response.choices[0]?.message?.content;

    if (!responseData) {
        throw new Error('No content returned from OpenAI');
    }

    return responseData;
};