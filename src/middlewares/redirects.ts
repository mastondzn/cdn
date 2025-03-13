import { middleware } from '~/utils/middleware';

export const redirects = middleware(async (ctx, next) => {
    if (ctx.req.path.startsWith('/files/')) {
        return ctx.redirect(new URL(ctx.req.url).pathname.replace('/files/', '/f/'));
    }
    await next();
});
