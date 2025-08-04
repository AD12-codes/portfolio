import 'dotenv/config';
import { logger } from 'better-auth';
import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import express from 'express';
import { auth } from './lib/auth';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '',
    methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.all('/api/auth{/*path}', toNodeHandler(auth));

app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).send('OK');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
