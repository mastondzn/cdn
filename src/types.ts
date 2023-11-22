import { type Hono } from 'hono';

export type Env = {
    APP_SECRET: string;
    BUCKET: R2Bucket;
    waitUntil: (promise: Promise<unknown>) => void;
};

export type Router = Hono<{
    Bindings: Env;
}>;
