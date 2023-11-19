import { z } from 'zod';

const bucket = z.custom<R2Bucket>(
    (value) => {
        return (
            typeof value === 'object' &&
            value !== null &&
            typeof (value as Record<string, unknown>).put === 'function'
        );
    },
    { message: 'BUCKET env var must be an R2Bucket' },
);

export const envSchema = z.object({
    APP_SECRET: z.string({
        required_error: 'APP_SECRET env var is required',
        invalid_type_error: 'APP_SECRET env var must be a string',
    }),
    BUCKET: bucket,
});

export type Env = z.infer<typeof envSchema>;
