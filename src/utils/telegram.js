const Telegraf = require('telegraf'),
  session = require('telegraf/session'),
  Scene = require('telegraf/scenes/base'),
  Stage = require('telegraf/stage'),
  Markup = require('telegraf/markup'),
  Extra = require('telegraf/extra'),
  User = require('../models/user');


const token = process.env.BOT_TOKEN;
const bot = new Telegraf(token);


// Functions
const generateInlineCallbackKeyboard = (buttons = []) => {
  const keyboard = Extra.HTML().markup((m) =>
    m.inlineKeyboard(buttons.map(b => m.callbackButton(b.caption, b.callback || b.caption))));

  return keyboard;
}

const getFiltersFromUrl = (url) => {

}


//Scenes
const getUrl = new Scene('getUrl')
getUrl.enter(ctx => ctx.reply('Send me your search URL please'));
getUrl.leave(ctx => ctx.reply('Alright!'))
getUrl.hears(/cancel/gi, Stage.leave())
getUrl.on('message', ctx => {
  return console.log(ctx.message)
})

//Scene manager
const stage = new Stage()
stage.command('cancel', Stage.leave())

stage.register(getUrl)

// Event Handlers
bot.start(async (ctx) => {
  const { from } = ctx
  try {
    let user = await User.findOne({ id: from.id })
    if (!user) {
      user = new User({ id: from.id, firstName: from.first_name, lastName: from.last_name, isBot: from.is_bot, userName: from.username, created: new Date() })
      await user.save();
      const buttons = [{ caption: 'Yes I am!', callback: 'setFilters' }, { caption: 'Not really', callback: 'abort' }];
      ctx.reply(`Great to meet you, ${user.firstName}!\nAre you looking for an appartment to rent?`,
        generateInlineCallbackKeyboard(buttons))
    }
    else {
      const buttons = [{ caption: 'Yes I am!', callback: 'setFilters' }, { caption: 'Not really', callback: 'abort' }];
      ctx.reply(`Hey, ${user.firstName}!\nAre you looking to update your settings?`,
        generateInlineCallbackKeyboard(buttons))
    }

  }
  catch (error) {
    console.log(error);
    ctx.reply("I'm so sorry, something went horribly wrong")
  }
})



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