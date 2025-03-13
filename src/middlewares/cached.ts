import { getCacheKey } from '~/utils/cache';
import { middleware } from '~/utils/middleware';

export const cached = middleware(async (ctx, next) => {
    const response = await caches.default.match(getCacheKey(ctx));

    if (response) {
        response.headers.set('x-cache-status', 'hit');
        return ctx.newResponse(response.body, response);
    }

    await next();
});
