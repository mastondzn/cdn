import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

import type { HonoEnv } from './types';
import * as middlewares from './middlewares';
import * as routes from './routes';

const app = new Hono<HonoEnv>()
    .use(middlewares.injectDb)
    .use(middlewares.poweredBy)
    .use(middlewares.redirects)
    .route('/', routes.files)
    .route('/', routes.upload)
    .route('/', routes.root)
    .notFound((ctx) => ctx.json({ error: 'Not found' }, { status: 404 }));

app.onError((error, ctx) => {
    if (error instanceof HTTPException) return error.getResponse();
    // eslint-disable-next-line no-console
    console.log(error);
    return ctx.json({ error: `Internal server error` }, { status: 500 });
});

export default app;
