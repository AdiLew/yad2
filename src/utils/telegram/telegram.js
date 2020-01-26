const Telegraf = require('telegraf'),
  session = require('telegraf/session'),
  stage = require('./stage/stage'),
  startCommand = require('./commands/start-command')

const token = process.env.BOT_TOKEN;
const bot = new Telegraf(token);


// Event Handlers
bot.start(startCommand)

// bot.action('setFilters', async (ctx) =>
//   ctx.scene.enter('getUrl')
// )

/*
bot.action('urlFilters', async (ctx) => {
  ctx.reply('Alright! Please to go ')
})*/




bot.use(session())
bot.use(stage.middleware())

bot.action('setFilters', async (ctx) =>
  ctx.scene.enter('getUrl')
)
bot.action(/.+/, (ctx) => {
  console.log(ctx);
  return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`)
})


module.exports = bot;