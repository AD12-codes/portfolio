import {
  type BetterAuthOptions,
  type BetterAuthPlugin,
  betterAuth,
} from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, anonymous, jwt, username } from 'better-auth/plugins';
import { redisClient } from '@/db/redis-client';
import { db } from '../db';
import {
  accounts,
  jwks,
  sessions,
  users,
  verifications,
} from '../db/schema/auth';

const betterAuthConfig = {
  database: drizzleAdapter(db, {
    provider: 'pg',

    schema: {
      users,
      sessions,
      accounts,
      verifications,
      jwks,
    },
  }),
  trustedOrigins: [process.env.CORS_ORIGIN || ''],
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    jwt(),
    anonymous(),
    username(),
    admin() as unknown as BetterAuthPlugin,
  ],
  user: {
    modelName: 'users',
  },
  session: {
    modelName: 'sessions',
  },
  account: {
    modelName: 'accounts',
  },
  verification: {
    modelName: 'verifications',
  },
  secondaryStorage: {
    get: async (key) => {
      const value = await redisClient.get(key);
      return value ? value : null;
    },
    set: async (key, value, ttl) => {
      if (ttl) {
        await redisClient.set(key, value, { EX: ttl });
      } else {
        await redisClient.set(key, value);
      }
    },
    delete: async (key) => {
      await redisClient.del(key);
    },
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth(betterAuthConfig) as ReturnType<
  typeof betterAuth<typeof betterAuthConfig>
>;
