import type { Context } from 'hono';

export function getOrigin(ctx: Context) {
    const host = ctx.req.header('x-forwarded-host') ?? ctx.req.header('host') ?? 'localhost:3002';
    const protocol = ctx.req.header('x-forwarded-proto') ?? 'http';
    return `${protocol}://${host}`;
}
