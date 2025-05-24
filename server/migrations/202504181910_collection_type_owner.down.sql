ALTER TABLE "collection" DROP COLUMN "owner_id";
ALTER TABLE "collection" DROP COLUMN "type";
ALTER TABLE "collection" ALTER COLUMN "visible" SET DEFAULT true;
ALTER TABLE "collection_place" DROP COLUMN "order";
