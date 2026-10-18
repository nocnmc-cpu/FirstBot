const express = require('express');
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

const app = express();

app.post('/api/index', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

function handleEvent(event) {
  // ถ้าไม่ใช่ข้อความตัวหนังสือ ให้ข้ามไป
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  // ส่งข้อความเดิมตอบกลับไป (Echo)
  const echo = { type: 'text', text: `คุณพิมพ์ว่า: ${event.message.text}` };
  return client.replyMessage(event.replyToken, echo);
}

const client = new line.Client(config);

module.exports = app;
