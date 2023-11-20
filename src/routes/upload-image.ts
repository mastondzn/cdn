import { defineRoute, generateSlug } from '~/utils';

export const route = defineRoute({
    methods: ['POST'],
    path: '/upload/image',
    handler: async (ctx) => {
        const formData = await ctx.req.parseBody();
        const image = formData['image'];

        if (!(image instanceof File)) {
            return ctx.json({ error: 'Invalid image in form data' }, { status: 400 });
        }

        const extension = image.name.split('.').at(-1);

        if (!extension || !['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension)) {
            return ctx.json({ error: 'Invalid image extension' }, { status: 400 });
        }

        let slug = generateSlug();
        let filename = `${slug}.${extension}`;
        const { BUCKET } = ctx.env;

        let tries = 0;

        // idk why im even doing this
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition
        while (true) {
            const existing = await BUCKET.head(filename);

            if (existing) {
                slug = generateSlug();
                filename = `${slug}.${extension}`;
                tries++;
            } else {
                break;
            }

            if (tries > 2) {
                return ctx.json({ error: 'Failed to generate unique slug.' }, { status: 500 });
            }
        }

        await BUCKET.put(filename, image, {
            customMetadata: {
                'content-type': image.type,
                'original-filename': image.name,
                'last-modified': new Date(image.lastModified).toISOString(),
                slug,
            },
        });

        const url = `${new URL(ctx.req.raw.url).origin}/${filename}`;

        return ctx.json({ status: 'ok', slug, filename, url });
    },
});
