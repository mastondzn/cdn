import { getCacheKey } from '~/utils/cache';
import { middleware } from '~/utils/middleware';

export const cached = middleware(async (ctx, next) => {
    const response = await caches.default.match(getCacheKey(ctx));

    if (response) {
        response.headers.set('x-cache-status', 'hit');
        return ctx.newResponse(response.body, response);
    }

    await next();

    if (ctx.res.headers.get('cache-control')?.includes('no-store') || !ctx.res.ok) {
        return;
    }

    ctx.executionCtx.waitUntil(
        caches.default.put(getCacheKey(ctx), ctx.res.clone()), //
    );
});
