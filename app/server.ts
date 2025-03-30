import express, { type Request, type Response } from 'express';
import Logger from '../src/utils/logger';
import { address } from 'ip';
import env from '../src/config/env';
import { connectNoSQL, connectSQL } from '../src/config/database';
import errorHandler from '../src/middlewares/errorMiddleWare';
import userRoutes from './../src/routes/user.routes';
import startSocketServer from './socket';
import { createServer } from 'http';
import { counters } from '../src/utils/metrics';
import { cacheGet, cacheSet } from '../src/config/redis';

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

app.get('/', (req: Request, res: Response) => {
  // Simulated fresh data
  const freshData = { movies: ['Film1s', 'Film2'] };

  // Store in Redis for 60s
  cacheSet('movies', JSON.stringify(freshData), 6000);
  res.status(201).json(env);
});

app.get('/get', async (req: Request, res: Response) => {
  const cachedData = await cacheGet('movies');
  console.log(cachedData);
  if (cachedData) return res.status(200).json(JSON.parse(cachedData)); // Cache hit
  res.status(201).json(env);
});

// Metrics endpoint
app.get('/metrics', async (req: Request, res: Response) => {
  res.set('Content-Type', 'text/plain');
  res.send(`
    # HELP db_reads_total Total number of database read operations
    # TYPE db_reads_total counter
    db_reads_total{database="db1"} ${counters.db1Reads}
    db_reads_total{database="db2"} ${counters.db2Reads}
    
    # HELP db_writes_total Total number of database write operations
    # TYPE db_writes_total counter
    db_writes_total{database="db1"} ${counters.db1Writes}
    db_writes_total{database="db2"} ${counters.db2Writes}
        `);
});

/** Handles Error */
app.use(errorHandler);

server.listen(env.PORT, () => {
  Logger.server(`Server started on http://${address()}:${env.PORT}`);
});
