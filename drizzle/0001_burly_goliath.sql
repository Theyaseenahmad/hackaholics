ALTER TABLE "customers" ALTER COLUMN "first_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "last_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "farms" ALTER COLUMN "pictures" SET DATA TYPE text;