/*
  Warnings:

  - The primary key for the `Canvas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Workspace` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_UserToWorkspace` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Canvas" DROP CONSTRAINT "Canvas_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "_UserToWorkspace" DROP CONSTRAINT "_UserToWorkspace_B_fkey";

-- AlterTable
ALTER TABLE "Canvas" DROP CONSTRAINT "Canvas_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "workspaceId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Canvas_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Canvas_id_seq";

-- AlterTable
ALTER TABLE "Workspace" DROP CONSTRAINT "Workspace_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Workspace_id_seq";

-- AlterTable
ALTER TABLE "_UserToWorkspace" DROP CONSTRAINT "_UserToWorkspace_AB_pkey",
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_UserToWorkspace_AB_pkey" PRIMARY KEY ("A", "B");

-- AddForeignKey
ALTER TABLE "Canvas" ADD CONSTRAINT "Canvas_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToWorkspace" ADD CONSTRAINT "_UserToWorkspace_B_fkey" FOREIGN KEY ("B") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
