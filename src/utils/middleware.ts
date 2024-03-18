import type { MiddlewareHandler } from 'hono';

import type { Env } from '~/types';

export function createMiddleware(middleware: MiddlewareHandler<{ Bindings: Env }>) {
    return middleware;
}
