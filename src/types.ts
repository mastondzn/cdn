import { type Hono } from 'hono';

export type Env = { APP_SECRET: string; BUCKET: R2Bucket };

export type Router = Hono<{ Bindings: Env }>;
