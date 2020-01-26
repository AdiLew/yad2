const Telegraf = require('telegraf'),
  session = require('telegraf/session')


const token = process.env.BOT_TOKEN;
const bot = new Telegraf(token);
const stage = require('./stage/stage')

const startCommand = require('./commands/start-command')




// Event Handlers
bot.start(startCommand)



bot.action('setFilters', async (ctx) => ctx.scene.enter('getUrl')
)


bot.action('urlFilters', async (ctx) => {
  ctx.reply('Alright! Please to go ')
})


bot.action(/.+/, (ctx) => {
  console.log(ctx);
  return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`)
})

bot.use(session())
bot.use(stage.middleware())



module.exports = bot;