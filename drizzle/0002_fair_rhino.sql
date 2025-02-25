ALTER TABLE "farms" ADD COLUMN "verifiedId" varchar(12) NOT NULL;--> statement-breakpoint
ALTER TABLE "farms" ADD CONSTRAINT "farms_verifiedId_unique" UNIQUE("verifiedId");