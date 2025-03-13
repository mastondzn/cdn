import { lookup } from 'mrmime';

import { cached } from '~/middlewares/cached';
import { getCacheKey } from '~/utils/cache';
import { route } from '~/utils/route';

export const images = route(
    'GET', //
    '/:filename',
    cached,
    async (ctx) => {
        const filename = ctx.req.param('filename');

        const image = await ctx.env.BUCKET.get(`images/${filename}`);
        if (!image) return ctx.notFound();

        const headers = new Headers();

        const contentType = lookup(filename);
        if (contentType) headers.set('content-type', contentType);

        headers.set('cache-control', 'public, max-age=14400, s-maxage=14400');
        headers.set('x-uploaded-at', image.uploaded.toISOString());

        const response = ctx.newResponse(image.body, { status: 200, headers });

        ctx.executionCtx.waitUntil(
            caches.default.put(getCacheKey(ctx), response.clone()), //
        );
        response.headers.set('x-cache-status', 'miss');

        return response;
    },
);
