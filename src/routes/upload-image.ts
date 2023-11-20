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

        let existing = true;
        let tries = 0;

        // idk why im even doing this
        while (existing) {
            const existingMeta = await BUCKET.head(filename);

            if (existingMeta) {
                slug = generateSlug();
                filename = `${slug}.${extension}`;
            } else {
                existing = false;
            }

            if (tries > 2) {
                return ctx.json({ error: 'Failed to generate unique slug.' }, { status: 500 });
            }

            tries++;
        }

        await BUCKET.put(filename, image, {
            customMetadata: {
                'content-type': image.type,
                'original-filename': image.name,
                'last-modified': new Date(image.lastModified).toISOString(),
                slug,
            },
        });

        const url = new URL(ctx.req.raw.url);
        url.pathname = `/${filename}`;
        for (const [key] of url.searchParams.entries()) {
            url.searchParams.delete(key);
        }

        console.log(url.href);

        return ctx.json({ status: 'ok', slug, filename, url: url.href });
    },
});
