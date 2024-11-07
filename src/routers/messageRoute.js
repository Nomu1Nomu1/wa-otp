import express from "express";
import axios from "axios";
import whatsappClient from "../services/WhatsappClient.js";
import pkg from "whatsapp-web.js";
import Image from "../models/images.js";
import Video from "../models/videos.js";
import User from "../models/user.js";
const { MessageMedia } = pkg;

const router = new express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

// router.post("/message", (req, res) => {
//   whatsappClient.sendMessage(req.body.phoneNumber, req.body.message);
//   res.send();
// })

router.post("/message", async (req, res) => {
  const { phoneNumber, message, mediaUrl, mediaType } = req.body;

  try {
    if (mediaUrl) {
      // Manually fetch media
      const response = await axios.get(mediaUrl, {
        responseType: "arraybuffer",
      });
      const mediaData = Buffer.from(response.data).toString("base64");
      const mimeType = response.headers["content-type"]; // Get MIME type from the headers
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
    const user = await User.findAll({
      attributes: ["phone_number"],
    });
    const phone_numbers = user.map(user => user.phone_number);

    for(const phone_number of phone_numbers ) {
      if (mediaUrl) {
        const response = await axios.get(mediaUrl, {
          responseType: "arraybuffer",
        });
        const mediaData = Buffer.from(response.data).toString("base64");
        const mimeType = response.headers["content-type"];
        const filename = mediaType === "video" ? "video.mp4" : "image.jpg";

        const media = new MessageMedia(mimeType, mediaData, filename);

        await whatsappClient.sendMessage(phone_number, media, {
          caption: message,
        });
      } else {
        await whatsappClient.sendMessage(phone_number, message);
      }
    }

    res.send({ status: "Broadcast sent successfully" });
  } catch (error) {
    console.error("Error sending broadcast:", error);
    res
      .status(500)
      .send({ status: "Failed to send broadcast", error: error.message });
  }
});

router.get("/media-photo", async (req, res) => {
  try {
    const images = await Image.findAll({
      attributes: ["gambar"],
    });

    const formatedImages = images.map((images) => ({
      gambar: images.gambar,
    }));

    const mediaImages = formatedImages.map((item) => ({
      ...item,
      gambar: `http://localhost:3000/src/assets/photo/${item.gambar}`,
    }));

    res.status(200).json(mediaImages);
  } catch (error) {
    res.status(500).send({ status: "Failed to send media", error });
  }
});

router.get("/media-video", async (req, res) => {
  try {
    const video = await Video.findAll({
      attributes: ["video"],
    });

    const formatedVideo = video.map((video) => ({
      video: video.video,
    }));

    const mediaVideo = formatedVideo.map((item) => ({
      ...item,
      video: `http://localhost:3000/src/assets/video/${item.video}`,
    }));

    res.status(200).json(mediaVideo);
  } catch (error) {
    res.status(500).send({ status: "Failed to send media", error });
  }
});

export default router;
