CREATE TABLE `files` (
	`slug` text PRIMARY KEY NOT NULL,
	`hash` text NOT NULL,
	`filename` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	`uploaded_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `files_hash_unique` ON `files` (`hash`);