import type { OnHandlerInterface } from 'hono/types';
import { Hono } from 'hono';

import type { Env } from '~/types';

// eslint-disable-next-line ts/no-explicit-any
export const route: OnHandlerInterface<{ Bindings: Env }> = (...args: [any, any]) => {
    return new Hono<{ Bindings: Env }>().on(...args);
};
