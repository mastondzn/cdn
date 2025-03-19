import type { MiddlewareHandler } from 'hono';

import type { HonoEnv } from '~/types';

export const middleware = (middleware: MiddlewareHandler<HonoEnv>) => middleware;
