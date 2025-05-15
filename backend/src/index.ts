import express, { Request, Response } from 'express';
import cors from 'cors';
import { descriptions } from './constantFiles/destriptions';
import OpenAI from "openai";
import 'dotenv/config';
import { getAnswerFromOpenAiExample2 } from './example2/getAnswerFromOpenAiExample2';
import { Message } from './example2/model';

const openaiConfig = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const port = 3000;
const api = '/internal.api'

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  console.log('✅ Someone just sent a request: ', req.method, req.url);
  next();
});

app.get(`${api}/descriptions`, async (_req: Request, res: Response) => {
  try {
       res.json({ descriptions })
    } catch (error) {
        console.error('Error in GET /descriptions:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
//example2
app.post(`${api}/get-answer-example2`, async (req: Request, res: Response) => {
  try {
    console.log('/Get-answer-example2 Request body: (all messages w/o system prompt)', req.body);

    const { messages } = req.body as { messages: Message[] };
    
    if (!messages) {
      console.error('Question parameter is required');
    }

    const answer = await getAnswerFromOpenAiExample2(openaiConfig, messages);
    console.log('Current answer from OpenAI:', answer);

    res.status(200).json({ answer });
  } catch (error) {
    console.error('Error in POST /get-answer: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post(`${api}/test-post-request`, (req: Request, res: Response) => {
  const body = req.body as { message: string };

  console.log('POST received: ', body.message);
  res.status(201).json({ message: 'Post data received correctly' });
});

app.listen(port, () => {
  console.log(`Backend works on http://localhost:${port}`);
});