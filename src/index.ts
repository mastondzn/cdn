import { Hono } from 'hono';

import { poweredByMiddleware } from './middlewares/powered-by';
import { redirectsMiddleware } from './middlewares/redirects';
import { fileRoute } from './routes/files';
import { imagesRoute } from './routes/images';
import { uploadFileRoute } from './routes/upload-file';
import { uploadImageRoute } from './routes/upload-image';
import type { Env } from './types';

const app = new Hono<{ Bindings: Env }>()
    .use(poweredByMiddleware)
    .use(redirectsMiddleware)
    .get('/', (ctx) => ctx.json({ message: 'Hello from mastondzn/cdn!' }))
    .route('/', fileRoute)
    .route('/', imagesRoute)
    .route('/', uploadFileRoute)
    .route('/', uploadImageRoute);

app.notFound((ctx) => ctx.json({ error: 'Not found' }, { status: 404 }));
app.onError((err, ctx) => {
    console.error(err);
    return ctx.json({ error: `Internal server error` }, { status: 500 });
});

export default app;
