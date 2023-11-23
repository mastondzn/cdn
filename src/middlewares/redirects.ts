import { defineMiddleware } from '~/utils';

export const middleware = defineMiddleware({
    path: '*',
    handler: async (ctx, next) => {
        if (ctx.req.path.startsWith('/files/')) {
            return ctx.redirect(new URL(ctx.req.url).pathname.replace('/files/', '/f/'));
        }

        await next();
    },
});
