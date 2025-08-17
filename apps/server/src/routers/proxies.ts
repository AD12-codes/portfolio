import express, { type RequestHandler } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { attachProxyAuth } from '@/middleware/attach-proxy-auth';

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
const MEDIA_PROCESSOR_PATH =
  process.env.MEDIA_PROCESSOR_URL || 'http://localhost:3001';
const mediaProcessorRouter: express.Router = express.Router();
mediaProcessorRouter.use(attachProxyAuth);

mediaProcessorRouter.get(
  '/health',
  createCustomProxy('/health', MEDIA_PROCESSOR_PATH, '/health')
);

mediaProcessorRouter.post(
  '/files',
  createCustomProxy('/files', MEDIA_PROCESSOR_PATH, '/files')
);

mediaProcessorRouter.get(
  '/files',
  createCustomProxy('/files', MEDIA_PROCESSOR_PATH, '/files')
);

export default mediaProcessorRouter;
