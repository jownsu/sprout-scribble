ALTER TABLE "email_tokens" DROP CONSTRAINT "email_tokens_id_token_pk";--> statement-breakpoint
ALTER TABLE "email_tokens" ALTER COLUMN "id" SET DATA TYPE text;