ALTER TABLE "collection" ADD COLUMN "type" varchar(255) NOT NULL DEFAULT 'basic';
ALTER TABLE "collection" ADD COLUMN "owner_id" varchar(255) NOT NULL DEFAULT 'admin';
ALTER TABLE "collection_place" ADD COLUMN "order" int NOT NULL DEFAULT 0;

ALTER TABLE "collection" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "collection" ALTER COLUMN "owner_id" DROP DEFAULT;
ALTER TABLE "collection" ALTER COLUMN "visible" DROP DEFAULT;
ALTER TABLE "collection_place" ALTER COLUMN "order" DROP DEFAULT;
