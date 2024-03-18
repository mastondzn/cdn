import { Hono } from 'hono';
import { type OnHandlerInterface } from 'hono/types';

import { type Env } from '~/types';

export const createRoute: OnHandlerInterface<{ Bindings: Env }> = (
    ...args: Parameters<OnHandlerInterface<{ Bindings: Env }>>
) => {
    return new Hono<{ Bindings: Env }>().on(...args);
};
