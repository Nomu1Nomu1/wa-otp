import express from 'express';
import whatsappClient from '../services/WhatsappClient.js';
import pkg from 'whatsapp-web.js';
import Image from '../models/images.js';
import Video from '../models/videos.js';
const { MessageMedia } = pkg;

const router = new express.Router();

router.get('/', (req, res) => {
  res.send('Hello World!');
});

// router.post("/message", (req, res) => {
//   whatsappClient.sendMessage(req.body.phoneNumber, req.body.message);
//   res.send();
// })

router.post("/message", async (req, res) => {
  const { phoneNumber, message, mediaUrl, mediaType } = req.body;

  try {
    if (mediaUrl && mediaType === 'video') {
      const media = await MessageMedia.fromUrl(mediaUrl, {
        mimetype: 'video/mp4'
      });
      await whatsappClient.sendMessage(phoneNumber, media, { caption: message });
    }
    else if (mediaUrl) {
      const media = await MessageMedia.fromUrl(mediaUrl);
      await whatsappClient.sendMessage(phoneNumber, media, { caption: message });
    } else {
      await whatsappClient.sendMessage(phoneNumber, message);
    }
    res.send({ status: 'Message sent successfully' });
  } catch (error) {
    console.log("Error sending message:", error);
    res.status(500).send({ status: 'Failed to send message', error: error.message });
  }
});

router.get('/media-photo', async (req, res) => {
  try {
    const images = await Image.findAll({
      attributes: ['gambar']
    });

    const formatedImages = images.map(images => ({
      gambar: images.gambar
    }));

    const mediaImages = formatedImages.map(item => ({
      ...item,
      gambar: `http://localhost:3000/src/assets/photo/${item.gambar}`
    }));

    res.status(200).json(mediaImages);
  } catch (error) {
    res.status(500).send({ status: 'Failed to send media', error });
  }
});

router.get('/media-video', async (req, res) => {
  try {
    const video = await Video.findAll({
      attributes: ['video']
    });

    const formatedVideo = video.map(video => ({
      video: video.video
    }));

    const mediaVideo = formatedVideo.map(item => ({
      ...item,
      video: `http://localhost:3000/src/assets/video/${item.video}`
    }));

    res.status(200).json(mediaVideo);
  } catch (error) {
    res.status(500).send({ status: 'Failed to send media', error });
  }
})

export default router;