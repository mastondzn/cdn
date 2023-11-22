import { Hono } from 'hono';

import * as middlewares from './middlewares';
import * as routes from './routes';
import { type Env, type Router } from './types';
import { registerMiddlewares, registerRoutes } from './utils';

const app: Router = new Hono();

registerMiddlewares(app, middlewares);
registerRoutes(app, routes);

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        return app.fetch(request, { ...env, waitUntil: ctx.waitUntil.bind(ctx) });
    },
};
