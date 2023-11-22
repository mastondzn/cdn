import { type MiddlewareHandler } from 'hono';

import { type Env, type Router } from '~/types';

// https://hono.dev/concepts/middleware#middleware

export const defineMiddleware = <
    const TPath extends string,
    TMiddlewareHandler extends MiddlewareHandler<{ Bindings: Env }, TPath>,
>(middleware: {
    name?: string;
    path: TPath;
    handler: TMiddlewareHandler;
}) => {
    return middleware;
};

export type Middleware = ReturnType<typeof defineMiddleware>;

export const registerMiddlewares = (app: Router, middlewares: Record<string, Middleware>) => {
    for (const middleware of Object.values(middlewares)) {
        if (Array.isArray(middleware.handler)) {
            app.use(middleware.path, ...middleware.handler);
        } else {
            app.use(middleware.path, middleware.handler);
        }
    }
};
