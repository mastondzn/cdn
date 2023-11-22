import { defineRoute } from '~/utils';

export const route = defineRoute({
    methods: ['GET'],
    path: '/:filename',
    handler: async (ctx) => {
        const filename = ctx.req.param('filename');
        const cacheKey = new Request(ctx.req.url);
        const cache = caches.default;

        let response = await cache.match(cacheKey);

        if (response) {
            const headers = new Headers(response.headers);
            headers.set('x-cache-status', 'hit');
            return ctx.newResponse(response.body, { ...response, headers });
        }

        const image = await ctx.env.BUCKET.get(`images/${filename}`);
        if (!image) {
            return ctx.notFound();
        }

        const contentType = image.customMetadata?.['content-type'];
        if (!contentType) {
            return ctx.json(
                { error: 'Could not get MIME type from metadata of this bucket object' },
                { status: 500 },
            );
        }

        const headers = new Headers();
        headers.set('cache-control', 'public, max-age=14400, s-maxage=14400');
        headers.set('content-type', contentType);
        headers.set('x-uploaded-at', image.uploaded.toISOString());

        response = ctx.newResponse(image.body, { status: 200, headers });

        ctx.executionCtx.waitUntil(cache.put(cacheKey, response));
        response.headers.set('x-cache-status', 'miss');
        return response;
    },
});
