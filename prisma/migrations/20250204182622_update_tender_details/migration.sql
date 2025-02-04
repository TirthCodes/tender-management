/*
  Warnings:

  - Added the required column `inLabour` to the `TenderDetailsTable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TenderDetailsTable" ADD COLUMN     "inLabour" INTEGER NOT NULL;
