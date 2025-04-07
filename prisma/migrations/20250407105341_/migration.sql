-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "bookingId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "flightId" INTEGER NOT NULL,
    "class" TEXT NOT NULL,
    "seatCount" INTEGER NOT NULL,
    "totalPrice" REAL NOT NULL,
    "pointsUsed" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelledAt" DATETIME,
    CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Booking_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("flightId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("bookingId", "cancelledAt", "class", "createdAt", "flightId", "pointsUsed", "seatCount", "status", "totalPrice", "userId") SELECT "bookingId", "cancelledAt", "class", "createdAt", "flightId", "pointsUsed", "seatCount", "status", "totalPrice", "userId" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE TABLE "new_LoyaltyPoint" (
    "pointId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "description" TEXT,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LoyaltyPoint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_LoyaltyPoint" ("addedAt", "description", "pointId", "points", "userId") SELECT "addedAt", "description", "pointId", "points", "userId" FROM "LoyaltyPoint";
DROP TABLE "LoyaltyPoint";
ALTER TABLE "new_LoyaltyPoint" RENAME TO "LoyaltyPoint";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
