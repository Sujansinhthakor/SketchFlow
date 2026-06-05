/*
  Warnings:

  - You are about to drop the column `name` on the `Canvas` table. All the data in the column will be lost.
  - Added the required column `name` to the `Workspace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Canvas" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "name" TEXT NOT NULL;
