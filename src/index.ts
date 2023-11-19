import { Hono } from 'hono';

import { type Env, envSchema } from './env';
import * as middlewares from './middlewares';
import * as routes from './routes';
import { type Router } from './types';
import { applyMiddleware } from './utils/middleware';
import { json } from './utils/responses';
import { applyRoute } from './utils/route';

const app: Router = new Hono<{ Bindings: Env }>();

for (const middleware of Object.values(middlewares)) {
    applyMiddleware(app, middleware);
}

// for (const route of Object.values(routes)) {
//     applyRoute(app, route);
// }

export default {
    async fetch(request: Request, _env: unknown): Promise<Response> {
        const env = envSchema.safeParse(_env);

        if (!env.success) {
            return json({ error: env.error.message }, { status: 500 });
        }

        return app.fetch(request, env.data);
    },
};
