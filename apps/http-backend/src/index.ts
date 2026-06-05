import express from "express";
import roomRouter from "./routes/room.route";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/room", roomRouter);

app.listen(8000, () => {
  console.log("http server is running at http://localhost:8000");
});
