CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(50),
	"last_name" varchar(50),
	"email" varchar(50),
	"password" varchar(255),
	"profile_image" varchar(255),
	"phone" varchar(10),
	"pincode" varchar(6),
	"address" varchar(500),
	"socket_id" varchar(255),
	"role" varchar(50) DEFAULT 'customer'
);
--> statement-breakpoint
CREATE TABLE "farmers" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(50),
	"last_name" varchar(50),
	"email" varchar(50),
	"password" varchar(255),
	"profile_image" varchar(255),
	"phone" varchar(10),
	"verification_id" varchar NOT NULL,
	"pincode" varchar(6) NOT NULL,
	"verified" boolean DEFAULT false,
	CONSTRAINT "farmers_verification_id_unique" UNIQUE("verification_id")
);
--> statement-breakpoint
CREATE TABLE "farms" (
	"id" serial PRIMARY KEY NOT NULL,
	"farmer_id" integer NOT NULL,
	"farm_name" varchar(255) NOT NULL,
	"pincode" varchar(6) NOT NULL,
	"area" varchar NOT NULL,
	"location" varchar NOT NULL,
	"type" varchar NOT NULL,
	"phone" varchar(13) NOT NULL,
	"pictures" text[],
	"description" varchar(400),
	"register_date" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "produce" (
	"id" serial PRIMARY KEY NOT NULL,
	"farmer_id" integer NOT NULL,
	"farm_id" integer NOT NULL,
	"produce_name" varchar(255) NOT NULL,
	"category" varchar NOT NULL,
	"price" integer NOT NULL,
	"picture" text,
	"quantity" varchar(10) NOT NULL,
	"availability" boolean DEFAULT true,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE "farms" ADD CONSTRAINT "farms_farmer_id_farmers_id_fk" FOREIGN KEY ("farmer_id") REFERENCES "public"."farmers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "produce" ADD CONSTRAINT "produce_farmer_id_farmers_id_fk" FOREIGN KEY ("farmer_id") REFERENCES "public"."farmers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "produce" ADD CONSTRAINT "produce_farm_id_farms_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."farms"("id") ON DELETE cascade ON UPDATE no action;