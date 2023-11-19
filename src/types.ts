import { type Hono } from 'hono';

import { type Env } from './env';

export type Router = Hono<{ Bindings: Env }>;
