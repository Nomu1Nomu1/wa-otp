import express from "express";
import axios from "axios";
import whatsappClient from "../services/WhatsappClient.js";
import pkg from "whatsapp-web.js";
import Informan from "../models/Informan.js";
import { Sequelize } from "sequelize";
const { MessageMedia } = pkg;

const router = new express.Router();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.post("/message", async (req, res) => {
  const { phoneNumber, message, mediaUrl, mediaType } = req.body;

  try {
    if (mediaUrl) {
      const response = await axios.get(mediaUrl, {
        responseType: "arraybuffer",
      });
      const mediaData = Buffer.from(response.data).toString("base64");
      const mimeType = response.headers["content-type"];
      const filename = mediaType === "video" ? "video.mp4" : "image.jpg";

      const media = new MessageMedia(mimeType, mediaData, filename);

      await whatsappClient.sendMessage(phoneNumber, media, {
        caption: message,
      });
    } else {
      await whatsappClient.sendMessage(phoneNumber, message);
    }
    res.send({ status: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res
      .status(500)
      .send({ status: "Failed to send message", error: error.message });
  }
});

router.post("/broadcast", async (req, res) => {
  const { message, mediaUrl, mediaType } = req.body;

  try {
    const informan = await Informan.findAll({
      attributes: ["nama","no_hp"],
      limit: 100,
      offset: 53,
    });

    const phone_numbers = informan.map((item) => item.no_hp);

    for(const phone_number of phone_numbers ) {

      const phoneSuffix = `${phone_number}@c.us`

      if (mediaUrl) {
        const response = await axios.get(mediaUrl, {
          responseType: "arraybuffer",
        });
        const mediaData = Buffer.from(response.data).toString("base64");
        const mimeType = response.headers["content-type"];
        const filename = mediaType === "video" ? "video.mp4" : "image.jpg";

        const media = new MessageMedia(mimeType, mediaData, filename);

        await whatsappClient.sendMessage(phoneSuffix, media, {
          caption: message,
        });
      } else {
        await whatsappClient.sendMessage(phoneSuffix, message);
      }

      const randomDelay = Math.floor(Math.random() * 3000) + 1000;
      await delay(randomDelay);
    }

    res.send({ status: "Broadcast sent successfully" });
  } catch (error) {
    console.error("Error sending broadcast:", error);
    res
      .status(500)
      .send({ status: "Failed to send broadcast", error: error.message });
  }
});

export default router;
