const Telegraf = require('telegraf');
const session = require('telegraf/session');
const stage = require('./stage/stage');

const identifyUserMiddleware = require('./middlewear/identifyUser-middleware');
const startCommand = require('./commands/start-command');
const getApartmentsListCommand = require('./commands/getAllApartments-command');

const token = process.env.BOT_TOKEN;
const bot = new Telegraf(token);

bot.use(session());
bot.use(stage.middleware());
bot.use(identifyUserMiddleware);

// Event Handlers
bot.start(startCommand);
bot.command('/setfilters', async (ctx) => ctx.scene.enter('GET_URL_WIZARD'));
bot.command('/getnew', (ctx) => getApartmentsListCommand(ctx, { isDetailed: true, newAptsOnly: true }));
bot.command('/getall', (ctx) => getApartmentsListCommand(ctx, { isDetailed: true }));
bot.command('/listnew', (ctx) => getApartmentsListCommand(ctx, { newAptsOnly: true }));
bot.command('/listall', (ctx) => getApartmentsListCommand(ctx, {}));




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