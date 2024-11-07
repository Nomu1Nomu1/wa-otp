import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";

const whatsappClient = new Client({
  puppeteer: { headless: true },
  authStrategy: new LocalAuth(),
  logLevel: 'verbose',
});

whatsappClient.on("qr", (qr) => {
  console.log(
    "QR Code diterima. Silakan pindai menggunakan aplikasi WhatsApp."
  );
  qrcode.generate(qr, { small: true });
});

whatsappClient.on("ready", () => console.log("client is ready"));

whatsappClient.on("message", async (msg) => {
  try {
    if (msg.from != "status@broadcast") {
      const contact = await msg.getContact();
      console.log(contact, msg.body);
    }
  } catch (error) {
    if (error.name === "ProtocolError") {
      console.log("ProtocolError: Konteks eksekusi dihancurkan");
    } else {
      console.log(error);
    }
  }
});

whatsappClient.on("disconnected", (reason) => {
  console.log("Client disconnected:", reason);
  setTimeout(() => {
    console.log("Attempting to reconnect...");
    whatsappClient.initialize();
  }, 10000); 
});

export default whatsappClient;
