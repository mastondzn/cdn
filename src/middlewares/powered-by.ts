import { middleware } from '~/utils/middleware';

export const poweredBy = middleware(async (ctx, next) => {
    await next();
    const response = ctx.res.clone();
    response.headers.set('x-powered-by', 'mastondzn/cdn (https://github.com/mastondzn/cdn)');
    return response;
});
