CREATE TABLE `account` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`user_id` text(255) NOT NULL,
	`account_id` text(255) NOT NULL,
	`provider_id` text(255) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text(255),
	`id_token` text,
	`password` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE TABLE `link_folder` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`icon` text(255) NOT NULL,
	`created_by_id` text(255) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `link_folder_created_by_idx` ON `link_folder` (`created_by_id`);--> statement-breakpoint
CREATE INDEX `link_folder_name_idx` ON `link_folder` (`name`);--> statement-breakpoint
CREATE TABLE `link` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`folder_id` text(255) NOT NULL,
	`title` text(255) NOT NULL,
	`url` text(2048) NOT NULL,
	`description` text,
	`created_by_id` text(255) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`folder_id`) REFERENCES `link_folder`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `link_folder_id_idx` ON `link` (`folder_id`);--> statement-breakpoint
CREATE INDEX `link_created_by_idx` ON `link` (`created_by_id`);--> statement-breakpoint
CREATE INDEX `link_title_idx` ON `link` (`title`);--> statement-breakpoint
CREATE TABLE `prompt_folder` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`icon` text(255) NOT NULL,
	`created_by_id` text(255) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `prompt_folder_created_by_idx` ON `prompt_folder` (`created_by_id`);--> statement-breakpoint
CREATE INDEX `prompt_folder_name_idx` ON `prompt_folder` (`name`);--> statement-breakpoint
CREATE TABLE `prompt` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`folder_id` text(255) NOT NULL,
	`title` text(255) NOT NULL,
	`prompt_text` text NOT NULL,
	`model` text(255) NOT NULL,
	`image_url` text(255),
	`created_by_id` text(255) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`folder_id`) REFERENCES `prompt_folder`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `prompt_folder_id_idx` ON `prompt` (`folder_id`);--> statement-breakpoint
CREATE INDEX `prompt_created_by_idx` ON `prompt` (`created_by_id`);--> statement-breakpoint
CREATE INDEX `prompt_title_idx` ON `prompt` (`title`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`user_id` text(255) NOT NULL,
	`token` text(255) NOT NULL,
	`expires_at` integer NOT NULL,
	`ip_address` text(255),
	`user_agent` text(255),
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_user_id_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`name` text(255),
	`email` text(255) NOT NULL,
	`email_verified` integer DEFAULT false,
	`image` text(255),
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`identifier` text(255) NOT NULL,
	`value` text(255) NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);