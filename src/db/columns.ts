import { customType } from 'drizzle-orm/sqlite-core';

export const timestamp = customType<{
    data: Date;
    driverData: string;
}>({
    dataType: () => 'text',
    fromDriver: (value: string): Date => new Date(value),
    toDriver: (value: Date): string => value.toISOString(),
});
