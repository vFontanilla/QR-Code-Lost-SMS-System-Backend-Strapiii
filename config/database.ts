// path: config/database.ts
export default ({ env }) => {
  const url = env('DATABASE_URL');

  if (url) {
    // Production: Supabase/Postgres via DATABASE_URL
    return {
      connection: {
        client: 'postgres',
        connection: {
          connectionString: url,
          ssl: env.bool('DATABASE_SSL', true) ? { rejectUnauthorized: false } : false,
        },
        pool: { min: 2, max: 10 },
        acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
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
