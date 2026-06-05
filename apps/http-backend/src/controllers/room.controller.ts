import { Request, Response } from "express";
import {
  addRoomService,
  deleteRoomService,
  getCanvasStateService,
  getRoomService,
  joinRoomService,
  saveCanvasStateService,
} from "../services/room.service";
import {
  RoomInput,
  roomSchema,
  addCanvasDataSchema,
  joinRoomSchema,
  deleteRoomSchema,
} from "@repo/common/types";

const addRoomController = async (req: Request, res: Response) => {
  console.log(req.body);
  const parsedData = roomSchema.safeParse({
    ...req.body,
    userId: req.user?.sub,
  });
  if (!parsedData.success) {
    return res.status(400).json({
      message: "Something went wrong",
      errors: parsedData.error,
    });
  }

  try {
    const result = await addRoomService(parsedData.data);
    return res.status(201).json({
      message: `room created successfully`,
      data: result,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
const getRoomController = async (req: Request, res: Response) => {
  try {
    if (!req.user?.sub) return;
    const userId: string = req.user?.sub;
    const result = await getRoomService(userId);
    return res.status(201).json({
      message: `Got all rooms Successfully`,
      data: result,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
const saveCanvasStateController = async (req: Request, res: Response) => {
  const userId = req.user?.sub;
  const parsedData = addCanvasDataSchema.safeParse({
    roomId: req.body.roomId,
    userId,
    canvasData: req.body.canvasData,
  });

  if (!parsedData.success) {
    return res.status(400).json({
      message: "Invalid request data",
      errors: parsedData.error,
    });
  }

  try {
    const result = await saveCanvasStateService(parsedData.data);
    return res.status(201).json({
      message: `Data got saved`,
      data: result,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getCanvasDataController = async (req: Request, res: Response) => {
  const slug = (req.query.slug || req.params.slug) as string;

  if (!slug) {
    return res.status(400).json({ message: "Slug is required" });
  }

  try {
    const result = await getCanvasStateService(slug);
    return res.status(201).json({
      message: `Got Canvas Data successfully`,
      data: result,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const joinRoomController = async (req: Request, res: Response) => {
  const parsedData = joinRoomSchema.safeParse({
    slug: req.body.slug,
    userId: req.user?.sub,
  });

  if (!parsedData.success) {
    return res.status(400).json({
      message: "Invalid request data",
      errors: parsedData.error,
    });
  }
  try {
    const result = await joinRoomService(parsedData.data);
    return res.status(201).json({
      message: `joined successfully`,
      data: result,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
const deleteRoomController = async (req: Request, res: Response) => {
  console.log("requset reacing her ");
  const parsedData = deleteRoomSchema.safeParse({
    roomId: req.body.roomId,
    userId: req.user?.sub,
  });

  if (!parsedData.success) {
    return res.status(400).json({
      message: "Invalid request data",
      errors: parsedData.error,
    });
  }
  try {
    const result = await deleteRoomService(parsedData.data);
    return res.status(201).json({
      message: `deleted successfully`,
      data: result,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
export {
  addRoomController,
  getRoomController,
  saveCanvasStateController,
  joinRoomController,
  deleteRoomController,
  getCanvasDataController,
};
