import { logger } from 'hono/logger';

import { defineMiddleware } from '~/utils/middleware';

export const middleware = defineMiddleware({
    path: '*',
    handler: logger(),
});
