import libraryItems from "./routes/libraryItems";
import categories from "./routes/categories";
import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"] }));
app.use(express.json());
app.use("/api/categories", categories);
app.use("/api/libraryitems", libraryItems);

app.listen(2277, () => console.log("Listening on port 2277..."));
