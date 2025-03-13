import type { MiddlewareHandler } from 'hono';

import type { Env } from '~/types';

export const middleware = (middleware: MiddlewareHandler<{ Bindings: Env }>) => middleware;
