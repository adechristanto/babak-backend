-- AlterTable
ALTER TABLE "public"."listings" ADD COLUMN     "location_address" TEXT,
ADD COLUMN     "location_city" TEXT,
ADD COLUMN     "location_country" TEXT,
ADD COLUMN     "location_place_id" TEXT;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "location_address" TEXT,
ADD COLUMN     "location_city" TEXT,
ADD COLUMN     "location_country" TEXT,
ADD COLUMN     "location_latitude" DECIMAL(10,8),
ADD COLUMN     "location_longitude" DECIMAL(11,8),
ADD COLUMN     "location_place_id" TEXT;
