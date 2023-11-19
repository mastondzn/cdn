import { type Handler } from 'hono';

import { type Env } from '~/env';
import { type Router } from '~/types';

export const defineRoute = <
    const TPath extends string,
    THandler extends Handler<{ Bindings: Env }, TPath>,
>(route: {
    name?: string;
    path: TPath;
    methods: ('get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options')[] | 'all';
    handler: THandler;
}) => {
    return route;
};

export type Route = ReturnType<typeof defineRoute>;

export const applyRoute = (app: Router, route: Route) => {
    if (route.methods === 'all') {
        app.all(route.path, route.handler);
    } else {
        for (const method of new Set(route.methods)) {
            // @ts-expect-error we cannot make ts know that this is ok (or maybe i dont know how)
            app[method](route.path, route.handler);
        }
    }
};
