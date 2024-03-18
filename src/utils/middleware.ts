import { type MiddlewareHandler } from 'hono';

import { type Env } from '~/types';

export const createMiddleware = (middleware: MiddlewareHandler<{ Bindings: Env }>) => {
    return middleware;
};
