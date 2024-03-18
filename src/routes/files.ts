import { lookup } from 'mrmime';

import { createRoute } from '~/utils/route';

export const fileRoute = createRoute(
    'GET', //
    '/f/:filename',
    async (ctx) => {
        const filename = ctx.req.param('filename');
        const cacheKey = new Request(ctx.req.url);
        const cache = caches.default;

        let response = await cache.match(cacheKey);
        if (response) {
            const headers = new Headers(response.headers);
            headers.set('x-cache-status', 'hit');
            return ctx.newResponse(response.body, { ...response, headers });
        }

        const file = await ctx.env.BUCKET.get(`files/${filename}`);
        if (!file) {
            return ctx.notFound();
        }

        const headers = new Headers();

        const contentType = lookup(filename);
        if (contentType) headers.set('content-type', contentType);
        headers.set('cache-control', 'public, max-age=14400, s-maxage=14400');
        headers.set('x-uploaded-at', file.uploaded.toISOString());

        response = ctx.newResponse(file.body, { status: 200, headers });

        ctx.executionCtx.waitUntil(cache.put(cacheKey, response.clone()));
        response.headers.set('x-cache-status', 'miss');
        return response;
    },
);
