import { sValidator } from '@hono/standard-validator';
import { eq } from 'drizzle-orm';
import * as z from 'zod';

import { files } from '~/db/schema';
import { auth } from '~/middlewares/auth';
import { hashBytes } from '~/utils/hash';
import { getOrigin } from '~/utils/origin';
import { route } from '~/utils/route';
import { generateSlug } from '~/utils/slug';

export const upload = route(
    'POST', //
    '/upload',
    auth,
    sValidator('form', z.object({ file: z.instanceof(File) }), (result, ctx) => {
        if (!result.success) {
            return ctx.json({ error: 'Invalid form data', issues: result.error }, { status: 400 });
        }
    }),
    async (ctx) => {
        const { file } = ctx.req.valid('form');
        const extension = file.name.split('.').at(-1);

        if (!extension || !['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension)) {
            return ctx.json({ error: 'Invalid file extension' }, { status: 400 });
        }

        const bytes = await file.bytes();
        const hash = hashBytes(bytes);

        const [entry] = await ctx.var.db.select().from(files).where(eq(files.hash, hash)).execute();
        if (entry) {
            const extension = entry.filename.split('.').at(-1);
            const url = `${getOrigin(ctx)}/${entry.slug}.${extension}`;
            return ctx.json({
                status: 'existing',
                slug: entry.slug,
                filename: entry.filename,
                url,
            });
        }

        const slug = generateSlug();
        const filename = `${slug}.${extension}`;
        const key = `images/${filename}`;

        await ctx.var.db
            .insert(files)
            .values({
                hash,
                slug,
                filename: file.name,
                mime: file.type,
                size: file.size,
                fileLastModified: new Date(file.lastModified),
            })
            .execute();

        await ctx.env.BUCKET.put(key, file, {
            customMetadata: {
                'content-type': file.type,
                'original-filename': file.name,
                'last-modified': new Date(file.lastModified).toISOString(),
                slug,
            },
        });

        const url = `${getOrigin(ctx)}/${filename}`;

        // pre-set cache
        // const cacheKey = new Request(url);
        // const headers = new Headers();
        // headers.set('cache-control', 'public, max-age=14400, s-maxage=14400');
        // headers.set('content-type', file.type);
        // headers.set('x-uploaded-at', object.uploaded.toISOString());
        // const response = ctx.newResponse(bytes, { status: 200, headers });
        // ctx.executionCtx.waitUntil(caches.default.put(cacheKey, response));

        return ctx.json({ status: 'ok', slug, filename, url });
    },
);
