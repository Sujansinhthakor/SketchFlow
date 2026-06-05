import dotenv from "dotenv";
dotenv.config();
import express from "express";
import roomRouter from "./routes/room.route";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/room", roomRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`http server is running at http://localhost:${PORT}`);
});
