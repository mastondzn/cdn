import { env } from 'cloudflare:workers';
import { bearerAuth } from 'hono/bearer-auth';

export const auth = bearerAuth({
    token: env.APP_SECRET,
    noAuthenticationHeaderMessage: { error: 'No token provided' },
    invalidAuthenticationHeaderMessage: { error: 'Invalid token' },
    invalidTokenMessage: { error: 'Invalid token' },
});
