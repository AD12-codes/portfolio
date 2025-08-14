import type { IncomingHttpHeaders } from 'node:http';
import { logger } from 'better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '@/lib/auth';

export const getJwtToken = async ({
  headers,
}: {
  headers: IncomingHttpHeaders;
}) => {
  try {
    const { token } = await auth.api.getToken({
      headers: fromNodeHeaders(headers),
    });
    return token;
  } catch (error) {
    logger.error(error as string);
    return null;
  }
};
