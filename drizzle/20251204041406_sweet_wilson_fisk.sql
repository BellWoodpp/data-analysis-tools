CREATE TABLE "verification_cooldown" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "verification_cooldown_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" bigint NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "verification_cooldown_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE INDEX "verification_cooldown_user_id_idx" ON "verification_cooldown" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_cooldown_expires_at_idx" ON "verification_cooldown" USING btree ("expires_at");