-- CreateTable
CREATE TABLE "public"."listing_views" (
    "id" SERIAL NOT NULL,
    "listing_id" INTEGER NOT NULL,
    "viewer_id" INTEGER,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "listing_views_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."listing_views" ADD CONSTRAINT "listing_views_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."listing_views" ADD CONSTRAINT "listing_views_viewer_id_fkey" FOREIGN KEY ("viewer_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
