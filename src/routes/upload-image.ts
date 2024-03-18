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

        const generateFilename = async () => {
            let tries = 0;

            // eslint-disable-next-line ts/no-unnecessary-condition
            while (true) {
                const slug = generateSlug();
                const filename = `${slug}.${extension}`;

                const existing = await ctx.env.BUCKET.head(`images/${filename}`);

                if (existing) {
                    tries++;
                } else {
                    return { filename, slug };
                }

                if (tries > 2) {
                    return { filename: null, slug: null };
                }
            }
        };

        const { filename, slug } = await generateFilename();
        if (!filename) {
            return ctx.json({ error: 'Failed to generate unique filename' }, { status: 500 });
        }

        const object = await ctx.env.BUCKET.put(`images/${filename}`, image, {
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
        const cache = caches.default;

        const headers = new Headers();
        headers.set('cache-control', 'public, max-age=14400, s-maxage=14400');
        headers.set('content-type', image.type);
        headers.set('x-uploaded-at', object.uploaded.toISOString());

        const response = ctx.newResponse(image.stream(), { status: 200, headers });
        ctx.executionCtx.waitUntil(cache.put(cacheKey, response));

        return ctx.json({ status: 'ok', slug, filename, url });
    },
);
