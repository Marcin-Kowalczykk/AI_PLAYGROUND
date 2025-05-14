import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import { descriptions } from './constantFiles/destriptions';

const app = express();
const port = 3000;
const api = '/internal.api'

app.use(cors());
app.use(express.json());

const basicErrorHandler = (res: Response) => {
    try {
       res
    } catch (error) {
        console.error('Error in GET /descriptions:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

app.use((req, _res, next) => {
  console.log('✅ Someone just sent a request: ', req.method, req.url);
  next();
});

app.get(`${api}/descriptions`, async (_req: Request, res: Response) => {
  const response = res.json({ descriptions })

  basicErrorHandler(response);
});

app.post(`${api}/test-post-request`, (req: Request, res: Response) => {
  const body = req.body as { message: string };

  console.log('POST received: ', body.message);
  res.status(201).json({ message: 'Post data received correctly' });
});

app.listen(port, () => {
  console.log(`Backend works on http://localhost:${port}`);
});