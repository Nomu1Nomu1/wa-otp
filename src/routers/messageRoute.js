import express from "express";
import axios from "axios";
import whatsappClient from "../services/WhatsappClient.js";
import pkg from "whatsapp-web.js";
import Informan from "../models/Informan.js";
const { MessageMedia } = pkg;

const router = new express.Router();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

router.get("/", (req, res) => {
  res.send("API is running");
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

  // get all informan
  const informan = await Informan.findAll({
    attributes: ["nama", "no_hp"],
    limit: 100,
    offset: 0,
  });

  // change no_hp to 62
  const phone_numbers = informan.map((data) => {
    if (data.no_hp.startsWith("0")) {
      return data.no_hp.replace("0", "62");
    }
    return data.no_hp;
  });

  // Menyimpan hasil log broadcast
  let logData = [];

  if (mediaUrl) {

    const response = await axios.get(mediaUrl, {
      responseType: "arraybuffer",
    });
    const mediaData = Buffer.from(response.data).toString("base64");
    const mimeType = response.headers["content-type"];
    const filename = mediaType === "video" ? "video.mp4" : "image.jpg";

    const media = new MessageMedia(mimeType, mediaData, filename);

    for (const phone_number of phone_numbers) {
      try {
        const phoneSuffix = `${phone_number}@c.us`;
        // send message
        await whatsappClient.sendMessage(phoneSuffix, media, {
          caption: message,
        });
        // Menyimpan log broadcast
        logData.push({ phone_number, status: "Message sent successfully" });

        // Delay between messages
        const randomDelay = Math.floor(Math.random() * 3000) + 1000;
        await delay(randomDelay);
      } catch (error) {
        console.error("Error sending message:", error);
        // Menyimpan log broadcast
        logData.push({
          phone_number,
          status: "Failed to send message",
          error: error.message,
        });
      }
    }
  } else {
    for (const phone_number of phone_numbers) {
      try {
        const phoneSuffix = `${phone_number}@c.us`;
        // send message
        await whatsappClient.sendMessage(phoneSuffix, message);
        // Menyimpan log broadcast
        logData.push({ phone_number, status: "Message sent successfully" });

        // Delay between messages
        const randomDelay = Math.floor(Math.random() * 3000) + 1000;
        await delay(randomDelay);
      } catch (error) {
        console.error("Error sending message:", error);
        // Menyimpan log broadcast
        logData.push({
          phone_number,
          status: "Failed to send message",
          error: error.message,
        });
      }
    }
  }

  // Menyimpan log broadcast ke file
  const timestamp = new Date().toISOString();
  fs.writeFileSync(
    "broadcast_log.json",
    JSON.stringify({ timestamp, logData }, null, 2)
  );
  console.log("Log broadcast tersimpan di broadcast_log.json");
});

export default router;
