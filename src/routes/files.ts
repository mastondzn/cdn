import { defineRoute } from '~/utils';

export const route = defineRoute({
    methods: ['GET'],
    path: '/files/:filename',
    handler: async (ctx) => {
        const filename = ctx.req.param('filename');

        const file = await ctx.env.BUCKET.get(`files/${filename}`);
        if (!file) {
            return ctx.notFound();
        }

        const contentType = file.customMetadata?.['content-type'];

        return ctx.newResponse(file.body, {
            status: 200,
            headers: {
                'cache-control': 'public, max-age=31536000',
                'x-uploaded-at': file.uploaded.toISOString(),
                ...(contentType ? { 'content-type': contentType } : {}),
            },
        });
    },
});
