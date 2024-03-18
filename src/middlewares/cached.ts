import { getCacheKey } from '~/utils/cache';
import { createMiddleware } from '~/utils/middleware';

export const cachedMiddleware = createMiddleware(async (ctx, next) => {
    const response = await caches.default.match(getCacheKey(ctx));
    if (response) {
        const headers = new Headers(response.headers);
        headers.set('x-cache-status', 'hit');
        return ctx.newResponse(response.body, { ...response, headers });
    }

    await next();
});
