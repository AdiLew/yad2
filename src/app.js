const express = require('express');
require('./db/mongoose');
const bot = require('./utils/telegram/telegram');

const app = express();
const port = process.env.PORT || 3300;

app.use(express.json());

app.listen(port, () => {
    console.log(`The server is up on port ${port}`);
})


//bot.launch();
bot.startPolling()