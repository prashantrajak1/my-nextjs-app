-- CreateTable
CREATE TABLE "BrickStock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sale" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleNo" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "rate" REAL NOT NULL,
    "totalAmount" REAL NOT NULL,
    "receivedAmount" REAL NOT NULL,
    "billPath" TEXT,
    "brickType" TEXT NOT NULL DEFAULT 'No.1',
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Sale" ("billPath", "createdAt", "date", "id", "quantity", "rate", "receivedAmount", "totalAmount", "updatedAt", "vehicleNo") SELECT "billPath", "createdAt", "date", "id", "quantity", "rate", "receivedAmount", "totalAmount", "updatedAt", "vehicleNo" FROM "Sale";
DROP TABLE "Sale";
ALTER TABLE "new_Sale" RENAME TO "Sale";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "BrickStock_type_key" ON "BrickStock"("type");
