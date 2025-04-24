import express, { type Request, type Response } from 'express';
import Logger from '../src/utils/logger';
import { address } from 'ip';
import env from '../src/config/env';
import { connectNoSQL, connectSQL } from '../src/config/database';
import errorHandler from '../src/middlewares/errorMiddleWare';
import userRoutes from './../src/routes/user.routes';
import startSocketServer from './socket';
import { createServer } from 'http';
import { cacheGet } from '../src/config/redis';

// redis.connect()
const app = express();
const server = createServer(app);
app.use(express.json());

/** Socket Server */
startSocketServer(server);

/** Database Connection */
connectSQL(); /* Connect to PostGreSQL */
connectNoSQL(); /* Connect to MongDB */
// redis.connect()

/* User Routes */
app.use('/api/v1/user/', userRoutes);

app.get('/get', async (req: Request, res: Response) => {
  const cachedData = await cacheGet('movies');
  console.log(cachedData);
  if (cachedData) return res.status(200).json(JSON.parse(cachedData)); // Cache hit
  res.status(201).json(env);
});

/** Handles Error */
app.use(errorHandler);

server.listen(env.PORT, () => {
  Logger.server(`Server started on http://${address()}:${env.PORT}`);
});
