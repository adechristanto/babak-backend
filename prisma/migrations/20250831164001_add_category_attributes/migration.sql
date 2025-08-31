-- CreateEnum
CREATE TYPE "public"."AttributeType" AS ENUM ('TEXT', 'NUMBER', 'BOOLEAN', 'DATE', 'SELECT', 'MULTISELECT', 'RANGE');

-- CreateEnum
CREATE TYPE "public"."AttributeDataType" AS ENUM ('STRING', 'INTEGER', 'DECIMAL', 'BOOLEAN', 'DATE', 'JSON');

-- CreateTable
CREATE TABLE "public"."category_attributes" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" "public"."AttributeType" NOT NULL,
    "dataType" "public"."AttributeDataType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "searchable" BOOLEAN NOT NULL DEFAULT true,
    "sortable" BOOLEAN NOT NULL DEFAULT false,
    "options" JSONB,
    "validation" JSONB,
    "unit" TEXT,
    "placeholder" TEXT,
    "helpText" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."listing_attributes" (
    "id" SERIAL NOT NULL,
    "listing_id" INTEGER NOT NULL,
    "attribute_id" INTEGER NOT NULL,
    "value" TEXT,
    "numeric_value" DECIMAL(15,4),
    "boolean_value" BOOLEAN,
    "date_value" TIMESTAMP(3),
    "json_value" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listing_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_attributes_category_id_key_key" ON "public"."category_attributes"("category_id", "key");

-- CreateIndex
CREATE INDEX "listing_attributes_attribute_id_numeric_value_idx" ON "public"."listing_attributes"("attribute_id", "numeric_value");

-- CreateIndex
CREATE INDEX "listing_attributes_attribute_id_value_idx" ON "public"."listing_attributes"("attribute_id", "value");

-- CreateIndex
CREATE INDEX "listing_attributes_attribute_id_boolean_value_idx" ON "public"."listing_attributes"("attribute_id", "boolean_value");

-- CreateIndex
CREATE UNIQUE INDEX "listing_attributes_listing_id_attribute_id_key" ON "public"."listing_attributes"("listing_id", "attribute_id");

-- AddForeignKey
ALTER TABLE "public"."category_attributes" ADD CONSTRAINT "category_attributes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."listing_attributes" ADD CONSTRAINT "listing_attributes_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."listing_attributes" ADD CONSTRAINT "listing_attributes_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "public"."category_attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
