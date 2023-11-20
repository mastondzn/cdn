import { defineRoute } from '~/utils';

export const route = defineRoute({
    methods: ['POST'],
    path: '/upload/file',
    handler: async (ctx) => {
        const formData = await ctx.req.parseBody();
        const file = formData['file'];

        if (!(file instanceof File)) {
            return ctx.json({ error: 'Invalid image in form data' }, { status: 400 });
        }

        const extension = file.name.split('.').at(-1);

        if (!extension) {
            return ctx.json({ error: 'No file extension' }, { status: 400 });
        }

        const { BUCKET } = ctx.env;

        const force = ctx.req.query('force') === 'true';
        const existing = await BUCKET.head(`files/${file.name}`);

        if (existing && !force) {
            return ctx.json({ error: 'File with this name already exists' }, { status: 400 });
        }

        await BUCKET.put(`files/${file.name}`, file, {
            customMetadata: {
                'content-type': file.type,
                'original-filename': file.name,
                'last-modified': new Date(file.lastModified).toISOString(),
            },
        });

        const url = `${new URL(ctx.req.raw.url).origin}/files/${file.name}`;

        return ctx.json({ status: 'ok', filename: file.name, url });
    },
});
