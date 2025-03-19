import type { OnHandlerInterface } from 'hono/types';
import { Hono } from 'hono';

import type { HonoEnv } from '~/types';

// eslint-disable-next-line ts/no-explicit-any
export const route: OnHandlerInterface<HonoEnv> = (...args: [any, any]) => {
    return new Hono<HonoEnv>().on(...args);
};
