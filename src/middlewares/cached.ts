import { createMiddleware } from '~/utils/middleware';

export const cachedMiddleware = createMiddleware(async (ctx, next) => {
    const cacheKey = new Request(ctx.req.url);

    const response = await caches.default.match(cacheKey);
    if (response) {
        const headers = new Headers(response.headers);
        headers.set('x-cache-status', 'hit');
        return ctx.newResponse(response.body, { ...response, headers });
    }

    await next();
});
