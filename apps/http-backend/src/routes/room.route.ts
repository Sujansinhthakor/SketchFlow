import { Router } from "express";
import {
  addRoomController,
  deleteRoomController,
  getCanvasDataController,
  getRoomController,
  joinRoomController,
  saveCanvasStateController,
} from "../controllers/room.controller";
import authMiddleware from "../middlewares/auth.middleware";

const roomRouter: Router = Router();
roomRouter.use(authMiddleware);
roomRouter.post("/add", addRoomController);
roomRouter.get("/get", getRoomController);
roomRouter.post("/join", joinRoomController);
roomRouter.delete("/delete", deleteRoomController);
roomRouter.post("/canvas/save", saveCanvasStateController);
roomRouter.get("/canvas/get", getCanvasDataController);

export default roomRouter;
