import { logger } from 'hono/logger';

import { defineMiddleware } from '~/utils';

export const middleware = defineMiddleware({
    path: '*',
    handler: logger(),
});
