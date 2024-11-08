import express from "express";
import messageRouter from "./src/routers/messageRoute.js";
import whatsappClient from "./src/services/WhatsappClient.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use("/src/assets/photo", express.static("src/assets/photo"));

whatsappClient.initialize().catch((err) => {
  console.log("Gagal menginisialisasi Klien WhatsApp", err);
});

app.use(express.json());
app.use(messageRouter);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
