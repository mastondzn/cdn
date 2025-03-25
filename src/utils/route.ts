import type { OnHandlerInterface } from 'hono/types';
import { Hono } from 'hono';

// eslint-disable-next-line ts/no-explicit-any
export const route: OnHandlerInterface = (...args: [any, any]) => {
    return new Hono().on(...args);
};
