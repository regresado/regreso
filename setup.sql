CREATE TABLE "regreso_destination_tag" (
	"destination_id" integer,
	"tag_id" integer,
	CONSTRAINT "regreso_destination_tag_destination_id_tag_id_unique" UNIQUE("destination_id","tag_id")
);

CREATE TABLE "regreso_destination" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"location" varchar(256),
	"type" varchar(256) NOT NULL,
	"body" text,
	"user_id" integer,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "regreso_email_verification_request" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"code" text NOT NULL,
	"email" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);

CREATE TABLE "regreso_passkey_credential" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" text NOT NULL,
	"algorithm" integer NOT NULL,
	"public_key" text NOT NULL
);

CREATE TABLE "regreso_password_reset_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"code" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"two_factor_verified" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);

CREATE TABLE "regreso_security_key_credential" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" text NOT NULL,
	"algorithm" integer NOT NULL,
	"public_key" text NOT NULL
);

CREATE TABLE "regreso_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"two_factor_verified" boolean DEFAULT false NOT NULL
);

CREATE TABLE "regreso_tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"display_name" varchar(256),
	"user_id" integer
);

CREATE TABLE "regreso_totp_credential" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"key" text NOT NULL,
	CONSTRAINT "regreso_totp_credential_user_id_unique" UNIQUE("user_id")
);

CREATE TABLE "regreso_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"google_id" text,
	"github_id" integer,
	"email" text NOT NULL,
	"display_name" text DEFAULT 'Anonymous' NOT NULL,
	"name" varchar(32) NOT NULL,
	"password_hash" varchar(256),
	"email_verified" boolean DEFAULT false NOT NULL,
	"recovery_code" varchar NOT NULL,
	"avatar_url" text,
	"bio" text DEFAULT 'Pelicans are epic',
	CONSTRAINT "regreso_user_google_id_unique" UNIQUE("google_id"),
	CONSTRAINT "regreso_user_github_id_unique" UNIQUE("github_id"),
	CONSTRAINT "regreso_user_email_unique" UNIQUE("email"),
	CONSTRAINT "regreso_user_name_unique" UNIQUE("name")
);

ALTER TABLE "regreso_destination_tag" ADD CONSTRAINT "regreso_destination_tag_destination_id_regreso_destination_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."regreso_destination"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "regreso_destination_tag" ADD CONSTRAINT "regreso_destination_tag_tag_id_regreso_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."regreso_tag"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "regreso_destination" ADD CONSTRAINT "regreso_destination_user_id_regreso_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."regreso_user"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "regreso_email_verification_request" ADD CONSTRAINT "regreso_email_verification_request_user_id_regreso_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."regreso_user"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "regreso_passkey_credential" ADD CONSTRAINT "regreso_passkey_credential_user_id_regreso_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."regreso_user"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "regreso_password_reset_session" ADD CONSTRAINT "regreso_password_reset_session_user_id_regreso_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."regreso_user"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "regreso_security_key_credential" ADD CONSTRAINT "regreso_security_key_credential_user_id_regreso_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."regreso_user"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "regreso_session" ADD CONSTRAINT "regreso_session_user_id_regreso_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."regreso_user"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "regreso_tag" ADD CONSTRAINT "regreso_tag_user_id_regreso_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."regreso_user"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "regreso_totp_credential" ADD CONSTRAINT "regreso_totp_credential_user_id_regreso_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."regreso_user"("id") ON DELETE no action ON UPDATE no action;
CREATE INDEX "email_index" ON "regreso_user" USING btree ("email");
CREATE INDEX "google_id_index" ON "regreso_user" USING btree ("google_id");
CREATE INDEX "github_id_index" ON "regreso_user" USING btree ("github_id");
