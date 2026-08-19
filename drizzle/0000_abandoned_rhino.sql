CREATE TABLE "country" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"image_url" text,
	"external_link" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"bio" text,
	"image_url" text,
	"country_id" integer
);
--> statement-breakpoint
CREATE TABLE "tribute" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_country_id_country_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."country"("id") ON DELETE set null ON UPDATE no action;