import { defineRoute } from '~/utils';

export const route = defineRoute({
    methods: ['GET'],
    path: '/:slug',
    handler: async (ctx) => {
        const slug = ctx.req.param('slug');
        const { BUCKET } = ctx.env;

        const image = await BUCKET.get(slug);
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

        return ctx.newResponse(image.body, {
            status: 200,
            headers: {
                'content-type': contentType,
                'cache-control': 'public, max-age=31536000',
                'x-uploaded-at': image.uploaded.toISOString(),
            },
        });
    },
});
