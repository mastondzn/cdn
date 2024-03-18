import { lookup } from 'mrmime';

import { cachedMiddleware } from '~/middlewares/cached';
import { createRoute } from '~/utils/route';

export const fileRoute = createRoute(
    'GET', //
    '/f/:filename',
    cachedMiddleware,
    async (ctx) => {
        const filename = ctx.req.param('filename');

        const file = await ctx.env.BUCKET.get(`files/${filename}`);
        if (!file) return ctx.notFound();

        const headers = new Headers();

        const contentType = lookup(filename);
        if (contentType) headers.set('content-type', contentType);

        headers.set('cache-control', 'public, max-age=14400, s-maxage=14400');
        headers.set('x-uploaded-at', file.uploaded.toISOString());

        const response = ctx.newResponse(file.body, { status: 200, headers });

        const cacheKey = new Request(ctx.req.url);
        ctx.executionCtx.waitUntil(caches.default.put(cacheKey, response.clone()));
        response.headers.set('x-cache-status', 'miss');

        return response;
    },
);
