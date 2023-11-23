import { Hono } from 'hono';

import * as middlewares from './middlewares';
import * as routes from './routes';
import { type Router } from './types';
import { registerMiddlewares, registerRoutes } from './utils';

const app: Router = new Hono();

app.notFound((ctx) => ctx.json({ error: 'Not found' }, { status: 404 }));
app.onError((err, ctx) => {
    console.error(err);
    return ctx.json({ error: `Internal server error` }, { status: 500 });
});

registerMiddlewares(app, middlewares);
registerRoutes(app, routes);

export default app;
