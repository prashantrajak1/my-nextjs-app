-- AlterTable
ALTER TABLE "Sale" ADD COLUMN "billPath" TEXT;

-- CreateTable
CREATE TABLE "LaborPayment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "laborId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LaborPayment_laborId_fkey" FOREIGN KEY ("laborId") REFERENCES "Labor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Labor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "due" REAL NOT NULL DEFAULT 0,
    "bricksMade" INTEGER NOT NULL DEFAULT 0,
    "daysWorked" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Labor" ("address", "createdAt", "due", "id", "name", "updatedAt") SELECT "address", "createdAt", "due", "id", "name", "updatedAt" FROM "Labor";
DROP TABLE "Labor";
ALTER TABLE "new_Labor" RENAME TO "Labor";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
