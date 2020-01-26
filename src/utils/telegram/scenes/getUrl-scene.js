const Scene = require('telegraf/scenes/base'),
    Stage = require('telegraf/stage')

const getUrl = new Scene('getUrl')
getUrl.enter(ctx => ctx.reply('Send me your search URL please'));
getUrl.leave(ctx => ctx.reply('Alright!'))
getUrl.hears(/cancel/gi, Stage.leave())
getUrl.on('message', ctx => {
    return console.log(ctx.message)
})

const getFiltersFromUrl = (url) => {

}

module.exports = getUrl;