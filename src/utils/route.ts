import { type Handler } from 'hono';

import { type Env, type Router } from '~/types';

export const defineRoute = <
    const TPath extends string,
    THandler extends Handler<{ Bindings: Env }, TPath>,
>(route: {
    // TODO: Implement priority
    // https://hono.dev/api/routing#routing-priority
    // priority?: number;

    name?: string;
    path: TPath;
    methods: ('GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS')[] | 'all';
    handler: THandler;
}) => {
    return route;
};

export type Route = ReturnType<typeof defineRoute>;

export const registerRoutes = (app: Router, routes: Record<string, Route>) => {
    for (const route of Object.values(routes)) {
        if (route.methods === 'all') {
            app.all(route.path, route.handler);
        } else {
            app.on(route.methods, route.path, route.handler);
        }
    }
};
