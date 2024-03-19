import type { Context } from 'hono';

export function getCacheKey(ctx: Context) {
    // we use the pathname because we don't want to cache based on query parameters
    // prevents some abuse
    const url = new URL(ctx.req.url);
    return new Request(`${url.origin}${url.pathname}`);
}
