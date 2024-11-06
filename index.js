const express = require("express")
const app = express()
const port = 3000
const messageRouter = require('./src/routers/messageRoute')
const whatsappClient = require('./src/services/WhatsappClient')

whatsappClient.initialize().catch(err => {
  console.log("Gagal menginisialisasi Klien WhatsApp", err);
});

app.use(express.json())
app.use(messageRouter)

app.listen(port, () => {
    console.log(`ready ${port}`)
  })