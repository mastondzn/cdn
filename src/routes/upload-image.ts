import { authMiddleware } from '~/middlewares/auth';
import { getOrigin } from '~/utils/origin';
import { createRoute } from '~/utils/route';
import { generateSlug } from '~/utils/slug';

export const uploadImageRoute = createRoute(
    'POST', //
    '/upload/image',
    authMiddleware,
    async (ctx) => {
        const formData = await ctx.req.parseBody();
        const image = formData.image;

        if (!(image instanceof File)) {
            return ctx.json({ error: 'Invalid image in form data' }, { status: 400 });
        }

        const extension = image.name.split('.').at(-1);

        if (!extension || !['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension)) {
            return ctx.json({ error: 'Invalid image extension' }, { status: 400 });
        }

        const slug = generateSlug();
        const filename = `${slug}.${extension}`;
        const key = `images/${filename}`;

        const existing = await ctx.env.BUCKET.head(key);
        if (existing) {
            return ctx.json({ error: 'Failed to create unique slug' }, { status: 500 });
        }

        const object = await ctx.env.BUCKET.put(key, image, {
            customMetadata: {
                'content-type': image.type,
                'original-filename': image.name,
                'last-modified': new Date(image.lastModified).toISOString(),
                slug,
            },
        });

        const url = `${getOrigin(ctx)}/${filename}`;

        // pre-set cache
        const cacheKey = new Request(url);
        const headers = new Headers();
        headers.set('cache-control', 'public, max-age=14400, s-maxage=14400');
        headers.set('content-type', image.type);
        headers.set('x-uploaded-at', object.uploaded.toISOString());

        const response = ctx.newResponse(image.stream(), { status: 200, headers });
        ctx.executionCtx.waitUntil(caches.default.put(cacheKey, response));

        return ctx.json({ status: 'ok', slug, filename, url });
    },
);
