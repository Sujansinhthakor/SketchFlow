import { z } from "zod";

// --- Schemas ---

export const roomSchema = z.object({
  userId: z.string(),
  name: z.string(),
});
export const addCanvasDataSchema = z.object({
  roomId: z.string(),
  userId: z.string(),
  canvasData: z.any(),
});
export const joinRoomSchema = z.object({
  slug: z.string(),
  userId: z.string(),
});
export const deleteRoomSchema = z.object({
  roomId: z.string(),
  userId: z.string(),
});
// --- Inferred Types ---
export type RoomInput = z.infer<typeof roomSchema>;
export type AddCanvasData = z.infer<typeof addCanvasDataSchema>;
export type JoinRoom = z.infer<typeof joinRoomSchema>;
export type DeleteRoom = z.infer<typeof deleteRoomSchema>;
