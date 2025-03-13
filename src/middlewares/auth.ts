import { bearerAuth } from 'hono/bearer-auth';

import { middleware } from '~/utils/middleware';

export const auth = middleware(async (ctx, next) => {
    const middleware = bearerAuth({
        token: ctx.env.APP_SECRET,
        noAuthenticationHeaderMessage: { error: 'No token provided' },
        invalidAuthenticationHeaderMessage: { error: 'Invalid token' },
        invalidTokenMessage: { error: 'Invalid token' },
    });

    return middleware(ctx, next);
});
