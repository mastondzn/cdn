import { createMiddleware } from '~/utils/middleware';

export const authMiddleware = createMiddleware(async (ctx, next) => {
    const token = ctx.req.query('auth') || ctx.req.header('Authorization');

    if (!token) {
        return ctx.json({ error: 'No token provided' }, { status: 401 });
    }

    if (token.trim() !== ctx.env.APP_SECRET) {
        return ctx.json({ error: 'Invalid token' }, { status: 401 });
    }

    await next();
});
