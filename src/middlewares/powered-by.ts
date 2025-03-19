import { middleware } from '~/utils/middleware';

export const poweredBy = middleware(async (ctx, next) => {
    await next();
    const headers = new Headers(ctx.res.headers);
    headers.set('x-powered-by', 'mastondzn/cdn (https://github.com/mastondzn/cdn)');
    return new Response(ctx.res.body, {
        status: ctx.res.status,
        statusText: ctx.res.statusText,
        headers,
    });
});
