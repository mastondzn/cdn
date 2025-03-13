import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

import type { Env } from './types';
import * as middlewares from './middlewares';
import * as routes from './routes';

const app = new Hono<{ Bindings: Env }>()
    .use(middlewares.poweredBy)
    .use(middlewares.redirects)
    .get('/', (ctx) => ctx.json({ message: 'Hello from mastondzn/cdn!' }))
    .route('/', routes.files)
    .route('/', routes.images)
    .route('/', routes.uploadFile)
    .route('/', routes.uploadImage);

app.notFound((ctx) => ctx.json({ error: 'Not found' }, { status: 404 }));

app.onError((error, ctx) => {
    console.error(error);

    if (error instanceof HTTPException) {
        return error.getResponse();
    }

    return ctx.json({ error: `Internal server error` }, { status: 500 });
});

export default app;
