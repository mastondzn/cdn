import { route } from '~/utils/route';

export const root = route('GET', '/', (ctx) => {
    return ctx.json({ status: 'Hello! This route currently does nothing.' });
});
