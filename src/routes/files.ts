import { lookup } from 'mrmime';

import { cached } from '~/middlewares/cached';
import { getCacheKey } from '~/utils/cache';
import { route } from '~/utils/route';

export const files = route(
    'GET', //
    '/f/:filename',
    cached,
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

        ctx.executionCtx.waitUntil(
            caches.default.put(getCacheKey(ctx), response.clone()), //
        );
        response.headers.set('x-cache-status', 'miss');

        return response;
    },
);
