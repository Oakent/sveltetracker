-- CreateEnum
CREATE TYPE "content_type" AS ENUM ('tv_episode', 'podcast', 'youtube', 'manual');

-- CreateTable
CREATE TABLE "Entry" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "language_profile" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "language_code" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "language_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_entry" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "profile_id" UUID NOT NULL,
    "type" "content_type" NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "logged_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source_url" TEXT,
    "metadata" JSONB,

    CONSTRAINT "content_entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tv_show_library" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "profile_id" UUID NOT NULL,
    "external_show_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "total_seasons" INTEGER NOT NULL,
    "show_metadata" JSONB,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tv_show_library_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "episode_log" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "content_entry_id" UUID NOT NULL,
    "library_id" UUID NOT NULL,
    "season_number" INTEGER NOT NULL,
    "episode_number" INTEGER NOT NULL,
    "duration_minutes" INTEGER NOT NULL,

    CONSTRAINT "episode_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "podcast_feed" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "profile_id" UUID NOT NULL,
    "feed_url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "feed_metadata" JSONB,

    CONSTRAINT "podcast_feed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "podcast_episode_log" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "content_entry_id" UUID NOT NULL,
    "feed_id" UUID NOT NULL,
    "episode_guid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "listened_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "podcast_episode_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "episode_log_content_entry_id_key" ON "episode_log"("content_entry_id");

-- CreateIndex
CREATE UNIQUE INDEX "episode_log_library_id_season_number_episode_number_key" ON "episode_log"("library_id", "season_number", "episode_number");

-- CreateIndex
CREATE UNIQUE INDEX "podcast_episode_log_content_entry_id_key" ON "podcast_episode_log"("content_entry_id");

-- CreateIndex
CREATE UNIQUE INDEX "podcast_episode_log_feed_id_episode_guid_key" ON "podcast_episode_log"("feed_id", "episode_guid");

-- AddForeignKey
ALTER TABLE "language_profile" ADD CONSTRAINT "language_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_entry" ADD CONSTRAINT "content_entry_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "language_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tv_show_library" ADD CONSTRAINT "tv_show_library_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "language_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episode_log" ADD CONSTRAINT "episode_log_content_entry_id_fkey" FOREIGN KEY ("content_entry_id") REFERENCES "content_entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episode_log" ADD CONSTRAINT "episode_log_library_id_fkey" FOREIGN KEY ("library_id") REFERENCES "tv_show_library"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "podcast_feed" ADD CONSTRAINT "podcast_feed_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "language_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "podcast_episode_log" ADD CONSTRAINT "podcast_episode_log_content_entry_id_fkey" FOREIGN KEY ("content_entry_id") REFERENCES "content_entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "podcast_episode_log" ADD CONSTRAINT "podcast_episode_log_feed_id_fkey" FOREIGN KEY ("feed_id") REFERENCES "podcast_feed"("id") ON DELETE CASCADE ON UPDATE CASCADE;
