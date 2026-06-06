-- CreateTable
CREATE TABLE "LibraryItemType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LibraryItemType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibraryItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "libraryItemTypeId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isBorrowable" BOOLEAN NOT NULL DEFAULT true,
    "borrower" TEXT,
    "borrowDate" TIMESTAMP(3),
    "author" TEXT,
    "nbrPages" INTEGER,
    "runTimeMinutes" INTEGER,

    CONSTRAINT "LibraryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LibraryItemType_name_key" ON "LibraryItemType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "LibraryItem" ADD CONSTRAINT "LibraryItem_libraryItemTypeId_fkey" FOREIGN KEY ("libraryItemTypeId") REFERENCES "LibraryItemType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibraryItem" ADD CONSTRAINT "LibraryItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
