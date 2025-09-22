-- CreateTable
CREATE TABLE `_accountsTosubjects` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_accountsTosubjects_AB_unique`(`A`, `B`),
    INDEX `_accountsTosubjects_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_accountsTosubjects` ADD CONSTRAINT `_accountsTosubjects_A_fkey` FOREIGN KEY (`A`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_accountsTosubjects` ADD CONSTRAINT `_accountsTosubjects_B_fkey` FOREIGN KEY (`B`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
