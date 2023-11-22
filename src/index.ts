import { Hono } from 'hono';

import * as middlewares from './middlewares';
import * as routes from './routes';
import { type Env, type Router } from './types';
import { registerMiddlewares, registerRoutes } from './utils';

const app: Router = new Hono<{ Bindings: Env }>();

registerMiddlewares(app, middlewares);
registerRoutes(app, routes);

export default app;
