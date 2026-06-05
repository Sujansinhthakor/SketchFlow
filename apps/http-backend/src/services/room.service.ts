import dotenv from "dotenv";
dotenv.config();
import { AddCanvasData, JoinRoom, RoomInput } from "@repo/common/types";
import { prisma } from "@repo/db";
import { nanoid } from "nanoid";
const makeSlug = async (nanoId: string) => {
  const a =
    nanoId.slice(0, 3) + "-" + nanoId.slice(3, 6) + "-" + nanoId.slice(6, 9);
  return a;
};
const addRoomService = async ({ userId, name }: RoomInput) => {
  const slug = await makeSlug(nanoid(12));
  const addRoom = await prisma.workspace.create({
    data: {
      name: name,
      slug: slug,
      users: {
        connect: {
          id: userId,
        },
      },
    },
  });
  return addRoom;
};

const getRoomService = async (userId: string) => {
  const rooms = await prisma.workspace.findMany({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      _count: {
        select: {
          users: true,
        },
      },
    },
  });

  return rooms.map((room) => ({
    id: room.id,
    slug: room.slug,
    name: room.name,
    updated: room.createdAt,
    isShared: room._count.users > 1,
  }));
};

const joinRoomService = async ({ slug, userId }: JoinRoom) => {
  const room = await prisma.workspace.update({
    where: {
      slug: slug,
    },
    data: {
      users: {
        connect: {
          id: userId,
        },
      },
    },
  });
  return room;
};

const deleteRoomService = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  // fetch the room
  const workspace = await prisma.workspace.findUnique({
    where: { id: roomId },
    include: {
      users: {
        select: { id: true },
      },
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  // making sure user if part of the space
  const isMember = workspace.users.some((user) => user.id === userId);
  if (!isMember) {
    throw new Error("Unauthorized: You are not a member of this workspace");
  }

  // if is shared space then we will disconnet the user or else delete
  if (workspace.users.length > 1) {
    const updatedWorkspace = await prisma.workspace.update({
      where: { id: roomId },
      data: {
        users: {
          disconnect: { id: userId },
        },
      },
    });
    return {
      action: "left",
      message: "Successfully left the shared workspace",
      data: updatedWorkspace,
    };
  } else {
    //delete the workspace
    const deletedWorkspace = await prisma.workspace.delete({
      where: { id: roomId },
    });
    return {
      action: "deleted",
      message: "Workspace deleted successfully",
      data: deletedWorkspace,
    };
  }
};

const saveCanvasStateService = async ({
  roomId,
  userId,
  canvasData,
}: AddCanvasData) => {
  const workspace = await prisma.workspace.findUnique({
    where: { slug: roomId },
  });
  const savedCanvas = await prisma.canvas.upsert({
    where: {
      workspaceId: workspace?.id || "",
    },
    update: {
      data: canvasData,
      userId,
    },
    create: {
      workspaceId: workspace?.id || "",
      data: canvasData,
      userId: userId,
    },
  });
  return savedCanvas;
};

const getCanvasStateService = async (slug: string) => {
  const workspace = await prisma.workspace.findUnique({
    where: { slug: slug },
  });
  console.log(workspace);

  const canvasData = await prisma.canvas.findUnique({
    where: {
      workspaceId: workspace?.id || "",
    },
    select: {
      data: true,
    },
  });
  console.log(canvasData);
  return canvasData?.data;
};
export {
  addRoomService,
  getRoomService,
  saveCanvasStateService,
  joinRoomService,
  deleteRoomService,
  getCanvasStateService,
};
