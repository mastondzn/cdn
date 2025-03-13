import { middleware } from '~/utils/middleware';

export const poweredBy = middleware(async (ctx, next) => {
    await next();
    ctx.res.headers.set('x-powered-by', 'mastondzn/cdn (https://github.com/mastondzn/cdn)');
});
