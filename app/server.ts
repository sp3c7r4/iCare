import express, { type Request, type Response } from 'express';
import Logger from '../src/utils/logger';
import { address } from 'ip';
import env from '../src/config/env';
import { connectDB } from '../src/config/database';

const app = express();

/** Database Connection */
connectDB();

app.get('/', (req: Request, res: Response) => {
  res.status(201).json(env);
});

app.listen(3000, () => {
  Logger(`Server started on http://${address()}:${3000}`);
});
