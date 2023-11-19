import { Hono } from 'hono';

import { type Env, envSchema } from './env';

const app = new Hono<{ Bindings: Env }>();

app.all('/', async (ctx, env) => {
    const allowedMethods = ['GET', 'PUT', 'DELETE'];

    if (!allowedMethods.includes(ctx.req.method)) {
        return ctx.json({ error: 'Method not allowed', status: 405 }, { status: 405 });
    }
});

export default {
    async fetch(request: Request, _env: unknown): Promise<Response> {
        const env = envSchema.safeParse(_env);

        if (!env.success) {
            return new Response(env.error.message, { status: 500 });
        }

        return app.fetch(request, env);
    },
};
