import { defineMiddleware } from '~/utils';

export const middleware = defineMiddleware({
    path: '*',
    handler: async (ctx, next) => {
        await next();
        ctx.res.headers.set('x-powered-by', 'mastondzn/cdn (https://github.com/mastondzn/cdn)');
    },
});
