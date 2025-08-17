import { logger } from 'better-auth';
import type { RequestHandler } from 'express';
import { getJwtToken } from '@/lib/get-jwt-token';

export const attachProxyAuth: RequestHandler = async (req, res, next) => {
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
