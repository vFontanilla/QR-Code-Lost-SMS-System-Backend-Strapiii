import { parse } from "pg-connection-string";

export default ({ env }) => {
  const hasPg = !!env("DATABASE_URL");

  if (hasPg) {
    // Parse DATABASE_URL for Supabase/Postgres
    const config = parse(env("DATABASE_URL"));

    return {
      connection: {
        client: "postgres",
        connection: {
          host: config.host,
          port: config.port,
          database: config.database,
          user: config.user,
          password: config.password,
          ssl: env.bool("DATABASE_SSL", true)
            ? { rejectUnauthorized: false }
            : false,
        },
        pool: { min: 2, max: 10 },
        acquireConnectionTimeout: env.int(
          "DATABASE_CONNECTION_TIMEOUT",
          60000
        ),
        debug: false,
      },
    };
  }

  // Local dev (SQLite)
  return {
    connection: {
      client: "sqlite",
      connection: {
        filename: env("DATABASE_FILENAME", ".tmp/data.db"),
      },
      useNullAsDefault: true,
      acquireConnectionTimeout: env.int(
        "DATABASE_CONNECTION_TIMEOUT",
        60000
      ),
    },
  };
};
