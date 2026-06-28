-- AlterTable
ALTER TABLE `orders` ADD COLUMN `carrier` VARCHAR(191) NULL,
    ADD COLUMN `trackingNumber` VARCHAR(191) NULL;
