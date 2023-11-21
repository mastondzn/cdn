import { z } from 'zod';

export const envSchema = z.object({
    APP_SECRET: z.string({
        required_error: 'APP_SECRET env var is required',
        invalid_type_error: 'APP_SECRET env var must be a string',
    }),
    BUCKET: z.custom<R2Bucket>(
        (value) =>
            typeof value === 'object' &&
            value !== null &&
            typeof (value as Record<string, unknown>).put === 'function',
        { message: 'BUCKET env var must be an R2Bucket' },
    ),
});

export const parseEnv = (env: unknown): Env | { error: string } => {
    const result = envSchema.safeParse(env);

    if (!result.success) {
        return {
            error: result.error.issues.reduce((acc, issue) => `${acc} ${issue.message}`, '').trim(),
        };
    }

    return result.data;
};

export type Env = z.infer<typeof envSchema>;
