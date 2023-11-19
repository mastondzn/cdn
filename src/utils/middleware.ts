import { type MiddlewareHandler } from 'hono';

import { type Env } from '~/env';
import { type Router } from '~/types';

// https://hono.dev/concepts/middleware#middleware

export const defineMiddleware = <
    const TPath extends string,
    TMiddlewareHandler extends MiddlewareHandler<{ Bindings: Env }, TPath>,
>(middleware: {
    name?: string;
    path: TPath;
    handler: TMiddlewareHandler[] | TMiddlewareHandler;
}) => {
    return middleware;
};

export type Middleware = ReturnType<typeof defineMiddleware>;

export const applyMiddleware = (app: Router, middleware: Middleware) => {
    if (Array.isArray(middleware.handler)) {
        app.use(middleware.path, ...middleware.handler);
        return;
    }
    app.use(middleware.path, middleware.handler);
};
