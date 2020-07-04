const Telegraf = require('telegraf');
const session = require('telegraf/session');
const stage = require('./stage/stage');
const startCommand = require('./commands/start-command');
const getAllApartments = require('./commands/getAllApartments-command');

const token = process.env.BOT_TOKEN;
const bot = new Telegraf(token);


// Event Handlers
bot.start(startCommand);
bot.command('/setfilters', async (ctx) => ctx.scene.enter('GET_URL_WIZARD'));
bot.command('/getreportnow', getAllApartments);



bot.use(session())
bot.use(stage.middleware())

bot.action('setFilters', async (ctx) =>
  ctx.scene.enter('GET_URL_WIZARD')
)
bot.action(/.+/, (ctx) => {
  console.log(ctx);
  return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`)
})

bot.catch((error) => {
  console.log(error);
})

module.exports = bot;