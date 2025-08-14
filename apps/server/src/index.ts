import 'dotenv/config';
import { logger } from 'better-auth';

import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import express from 'express';
import { auth } from './lib/auth';

import mediaProcessorRouter from './routers/proxies';

export const app: express.Express = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.all('/api/auth/*splat', toNodeHandler(auth));
const v1Router = express.Router();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

v1Router.use('/media-processor', mediaProcessorRouter);

app.use(v1Router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
