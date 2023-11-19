import { defineMiddleware } from '~/utils/middleware';

export const middleware = defineMiddleware({
    path: '*',
    handler: async (ctx, next) => {
        const method = ctx.req.method;
        const supportedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

        if (!supportedMethods.includes(method)) {
            return ctx.json({ error: 'Method not supported' }, { status: 405 });
        }

        return next();
    },
});
