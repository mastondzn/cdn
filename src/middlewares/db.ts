import { drizzle } from 'drizzle-orm/d1';

import type { Database } from '~/types';
import * as schema from '~/db/schema';
import { middleware } from '~/utils/middleware';

let db: Database | undefined;

export const injectDb = middleware(async (ctx, next) => {
    db ??= drizzle(ctx.env.DB, { schema });
    ctx.set('db', db);
    await next();
});
