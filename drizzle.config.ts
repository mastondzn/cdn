/* eslint-disable ts/no-non-null-assertion */
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'sqlite',
    driver: 'd1-http',
    out: './migrations',
    schema: './src/db/schema.ts',
    dbCredentials: {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
        databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
        token: process.env.CLOUDFLARE_TOKEN!,
    },
});
