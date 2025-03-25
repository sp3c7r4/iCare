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

const app = express();
const server = createServer(app);
app.use(express.json());

/** Socket Server */
startSocketServer(server);

/** Database Connection */
connectSQL(); /* Connect to PostGreSQL */
connectNoSQL(); /* Connect to MongDB */

/* User Routes */
app.use('/api/v1/user/', userRoutes);

app.get('/', (req: Request, res: Response) => {
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
