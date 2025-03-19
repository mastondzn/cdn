import { integer, sqliteTable as table, text } from 'drizzle-orm/sqlite-core';

import { timestamp } from './columns';

export const files = table('files', {
    slug: text().primaryKey(),
    hash: text().notNull().unique(),
    filename: text().notNull(),
    mime: text().notNull(),
    size: integer().notNull(),
    fileLastModified: timestamp('file_last_modified').notNull(),
    uploadedAt: timestamp('uploaded_at')
        .notNull()
        .$default(() => new Date()),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$default(() => new Date()),
});
