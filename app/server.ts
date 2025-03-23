import express, { type Request, type Response } from 'express';
import Logger from '../src/utils/logger';
import { address } from 'ip';
import env from '../src/config/env';
import { connectNoSQL, connectSQL } from '../src/config/database';
import errorHandler from '../src/middlewares/errorMiddleWare';
import userRoutes from './../src/routes/user.routes';
import startSocketServer from './socket';
import { createServer } from 'http';

const app = express();
const server = createServer(app);
app.use(express.json());

/** Socket Server */
startSocketServer(server);

/** Database Connection */
connectSQL(); /* Connect to PostGreSQL */
connectNoSQL(); /* Connect to MongDB */

app.get('/', (req: Request, res: Response) => {
  res.status(201).json(env);
});

/* User Routes */
app.use('/api/v1/user/', userRoutes);

/** Handles Error */
app.use(errorHandler);

server.listen(env.PORT, () => {
  Logger.server(`Server started on http://${address()}:${env.PORT}`);
});
