import { Hono } from 'hono';

import * as middlewares from './middlewares';
import * as routes from './routes';
import { type Router } from './types';
import { registerMiddlewares, registerRoutes } from './utils';

const app: Router = new Hono();

app.notFound((ctx) => ctx.json({ error: 'Not found' }, { status: 404 }));
app.onError((err, ctx) =>
    ctx.json({ error: `Internal server error (${err.message})` }, { status: 500 }),
);

registerMiddlewares(app, middlewares);
registerRoutes(app, routes);

export default app;
