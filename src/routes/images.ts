import { defineRoute } from '~/utils';

export const route = defineRoute({
    methods: ['GET'],
    path: '/:filename',
    handler: async (ctx) => {
        const filename = ctx.req.param('filename');
        const cacheKey = new Request(ctx.req.raw.url);
        const cache = caches.default;

        let response = await cache.match(cacheKey);

        if (response) {
            return ctx.newResponse(response.body, {
                headers: [...response.headers.entries(), ['x-cache-status', 'hit']],
            });
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

        response = ctx.newResponse(image.body, {
            status: 200,
            headers,
        });

        ctx.env.waitUntil(cache.put(cacheKey, response.clone()));
        response.headers.set('x-cache-status', 'miss');
        return response;
    },
});
