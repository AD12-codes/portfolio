// server/proxies/createProxy.ts

import { logger } from 'better-auth';
import express, { type RequestHandler } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
// import { logger } from 'better-auth';
import { getJwtToken } from '@/lib/get-jwt-token';
// import { getJwtToken } from '@/lib/get-jwt-token';

export const createCustomProxy = (
  path: string,
  target: string,
  rewriteTo: string
): RequestHandler =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^${path}`]: rewriteTo,
    },
  });

// media-processor service
const mediaProcessorRouter: express.Router = express.Router();
const MEDIA_PROCESSOR_PATH =
  process.env.MEDIA_PROCESSOR_URL || 'http://localhost:3001';

// Attach JWT to request headers before proxying (async-safe)
const attachProxyAuth: RequestHandler = async (req, res, next) => {
  try {
    const token = await getJwtToken({ headers: req.headers });
    if (typeof token === 'string' && token) {
      req.headers.authorization = `Bearer ${token}`;
      logger.info('JWT token added to request headers');
    } else {
      logger.warn('No JWT token available for proxy request');
      return res
        .status(401)
        .json({ code: 'UNAUTHENTICATED', message: 'Sign in required' });
    }
  } catch (error) {
    logger.error('Error getting JWT token for proxy:', error);
    return res
      .status(401)
      .json({ code: 'UNAUTHENTICATED', message: 'Sign in required' });
  } finally {
    next();
  }
};

mediaProcessorRouter.get(
  '/health',
  attachProxyAuth,
  createCustomProxy('/health', MEDIA_PROCESSOR_PATH, '/health')
);

mediaProcessorRouter.post(
  '/files',
  attachProxyAuth,
  createCustomProxy('/files', MEDIA_PROCESSOR_PATH, '/files')
);

mediaProcessorRouter.get(
  '/files',
  attachProxyAuth,
  createCustomProxy('/files', MEDIA_PROCESSOR_PATH, '/files')
);

export default mediaProcessorRouter;
