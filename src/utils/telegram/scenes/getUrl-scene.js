const url = require('url'),
    Scene = require('telegraf/scenes/base'),
    Stage = require('telegraf/stage')

const getUrl = new Scene('getUrl')
getUrl.enter(ctx =>
    ctx.reply('Send me your search URL, or send "cancel" to cancel the operation.')
);

getUrl.leave(ctx =>
    ctx.reply('Alright!')
)

getUrl.hears(/^(https?:\/\/)?(www.)?(yad2.co.il)\/realestate\/rent\?[\S]*$/gi, async (ctx) => {
    await ctx.reply('Gotcha. Let me check');
    getFiltersFromUrl(ctx.message.text, ctx.session.user)
    Stage.leave()

})
getUrl.hears(/^(https?:\/\/)?(www.)?(yad2.co.il)\/realestate(\/(rent(\??))?)?$/gi, (ctx) => { ctx.reply("Great! You're in the realestate page! Now perform your search and then send me the address.") })
getUrl.hears(/^(https?:\/\/)?(www.)?(yad2.co.il)$/gi, (ctx) => { ctx.reply("Yes, that's Yad 2. But I need you to first search and then send me the URL.") })
getUrl.hears(/cancel/gi,
    Stage.leave()
)

getUrl.on('message', ctx => {
    return console.log(ctx.message)
})

const getFiltersFromUrl = async (searchUrl, user) => {
    const myUrl = url.parse(searchUrl);
    const searchParams = queryStringToSearchParams(myUrl.query);
    user.filters = searchParams;
    await user.save()
}

const queryStringToSearchParams = (query) => {
    const paramArray = query.split('&').map(p => p.split('='));
    const params = Object.fromEntries(paramArray);
    return params;
}
module.exports = getUrl;