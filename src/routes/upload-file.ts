import { authMiddleware } from '~/middlewares/auth';
import { getOrigin } from '~/utils/origin';
import { createRoute } from '~/utils/route';

export const uploadFileRoute = createRoute(
    'POST', //
    '/upload/file',
    authMiddleware,
    async (ctx) => {
        const formData = await ctx.req.parseBody();
        const file = formData['file'];

        if (!(file instanceof File)) {
            return ctx.json({ error: 'Invalid image in form data' }, { status: 400 });
        }

        const extension = file.name.split('.').at(-1);
        if (!extension) {
            return ctx.json({ error: 'No file extension' }, { status: 400 });
        }

        const force = ctx.req.query('force') === 'true';
        const existing = await ctx.env.BUCKET.head(`files/${file.name}`);

        if (existing && !force) {
            return ctx.json({ error: 'File with this name already exists' }, { status: 400 });
        }

        await ctx.env.BUCKET.put(`files/${file.name}`, file, {
            customMetadata: {
                'content-type': file.type,
                'original-filename': file.name,
                'last-modified': new Date(file.lastModified).toISOString(),
            },
        });

        const url = `${getOrigin(ctx)}/f/${file.name}`;

        return ctx.json({ status: 'ok', filename: file.name, url });
    },
);
