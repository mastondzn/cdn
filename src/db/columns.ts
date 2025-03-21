import { customType } from 'drizzle-orm/sqlite-core';

export const timestamp = customType<{
    data: Date;
    driverData: string;
}>({
    dataType: () => 'text',
    fromDriver: (value) => new Date(value),
    toDriver: (value) => value.toISOString(),
});
