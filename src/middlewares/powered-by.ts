import { createMiddleware } from '~/utils/middleware';

export const poweredByMiddleware = createMiddleware(async (ctx, next) => {
    await next();
    ctx.res.headers.set('x-powered-by', 'mastondzn/cdn (https://github.com/mastondzn/cdn)');
});
