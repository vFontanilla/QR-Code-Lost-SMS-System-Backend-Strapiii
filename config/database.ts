// path: config/database.ts
import { parse } from 'pg-connection-string';

export default ({ env }) => {
  const url = env('DATABASE_URL');

  if (url) {
    const cfg = parse(url);
    return {
      connection: {
        client: 'postgres',
        connection: {
          host: cfg.host,
          port: Number(cfg.port || 5432),
          database: (cfg.database as string) || 'postgres',
          user: cfg.user,
          password: cfg.password,
          ssl: { rejectUnauthorized: false }, // required by Supabase
        },
        pool: { min: 0, max: 10 },
      },
    };
  }

  // Local dev fallback: SQLite
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: env('DATABASE_FILENAME', '.tmp/data.db'),
      },
      useNullAsDefault: true,
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
