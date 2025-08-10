export default ({ env }) => {
  const hasPg = !!env('DATABASE_URL');

  if (hasPg) {
    // Production / Supabase
    return {
      connection: {
        client: 'postgres',
        connection: {
          connectionString: env('DATABASE_URL'),
          ssl: env.bool('DATABASE_SSL', true) ? { rejectUnauthorized: false } : false,
        },
        pool: { min: 2, max: 10 },
        acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
      },
    };
  }

  // Local dev (SQLite)
  return {
    connection: {
      client: 'sqlite',
      connection: { filename: env('DATABASE_FILENAME', '.tmp/data.db') },
      useNullAsDefault: true,
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
