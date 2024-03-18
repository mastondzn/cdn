import { createMiddleware } from '~/utils/middleware';

export const redirectsMiddleware = createMiddleware(async (ctx, next) => {
    if (ctx.req.path.startsWith('/files/')) {
        return ctx.redirect(new URL(ctx.req.url).pathname.replace('/files/', '/f/'));
    }
    await next();
});
