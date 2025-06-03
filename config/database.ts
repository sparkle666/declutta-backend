import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'pg', // Change to 'pg' if you want PostgreSQL as default
  connections: {
    sqlite: {
      client: 'better-sqlite3',
      connection: {
        filename: './database/db.sqlite3' // Changed path
      },
      useNullAsDefault: true,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
    pg: {
      client: 'pg',
      connection: {
        host: env.get('PG_HOST'),
        port: env.get('PG_PORT') ? Number(env.get('PG_PORT')) : undefined,
        user: env.get('PG_USER'),
        password: env.get('PG_PASSWORD'),
        database: env.get('PG_DB_NAME'),
        ssl: env.get('PG_SSL', 'false') === 'true'
          ? { rejectUnauthorized: false }
          : false,
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig