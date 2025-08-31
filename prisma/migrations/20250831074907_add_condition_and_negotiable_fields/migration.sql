-- CreateEnum
CREATE TYPE "public"."ListingCondition" AS ENUM ('NEW', 'LIKE_NEW', 'EXCELLENT', 'GOOD', 'FAIR', 'POOR');

-- CreateEnum
CREATE TYPE "public"."NegotiableStatus" AS ENUM ('FIXED_PRICE', 'NEGOTIABLE', 'MAKE_OFFER');

-- AlterTable
ALTER TABLE "public"."listings" ADD COLUMN     "condition" "public"."ListingCondition" DEFAULT 'GOOD',
ADD COLUMN     "negotiable" "public"."NegotiableStatus" NOT NULL DEFAULT 'FIXED_PRICE';
