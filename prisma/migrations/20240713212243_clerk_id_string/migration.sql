-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "crypto" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "imageUrl" TEXT,
    "amount" REAL NOT NULL,
    "total" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("amount", "createdAt", "crypto", "id", "imageUrl", "price", "total", "updatedAt", "userId") SELECT "amount", "createdAt", "crypto", "id", "imageUrl", "price", "total", "updatedAt", "userId" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
