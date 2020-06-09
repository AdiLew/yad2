const url = require('url'),
    Scene = require('telegraf/scenes/base'),
    Stage = require('telegraf/stage'),
    User = require('../../../models/user')

const getUrl = new Scene('getUrl')
getUrl.enter(ctx =>
    ctx.reply('Send me your search URL, or send "cancel" to cancel the operation.')
);

getUrl.leave(ctx =>
    ctx.reply('Alright!')
)

getUrl.hears(/^(https?:\/\/)?(www.)?(yad2.co.il)\/realestate\/rent\?[\S]*$/gi, async (ctx,next) => {
    await ctx.reply('Gotcha. Let me check');
    const filters = getFiltersFromUrl(ctx.message.text)
    const user = await User.findOne({ id: ctx.from.id })
    if(user){
        user.filters = filters;
        try{
            await user.save()
        } catch (error){
            console.log(error)
        }
    }
      try{
         const leave = Stage.leave()
         leave(ctx)
        }
     catch(err){
         console.error(err)
     }
})
getUrl.hears(/^(https?:\/\/)?(www.)?(yad2.co.il)\/realestate(\/(rent(\??))?)?$/gi, (ctx) => { ctx.reply("Great! You're in the realestate page! Now perform your search and then send me the address.") })
getUrl.hears(/^(https?:\/\/)?(www.)?(yad2.co.il)$/gi, (ctx) => { ctx.reply("Yes, that's Yad 2. But I need you to first search and then send me the URL.") })
getUrl.hears(/cancel/gi, Stage.leave());


getUrl.on('message', async ctx => {
     await ctx.reply('come again?')
})

const getFiltersFromUrl = (searchUrl, user) => {
    const myUrl = url.parse(searchUrl);
    const searchParams = queryStringToSearchParams(myUrl.query);
    return searchParams;
}

const queryStringToSearchParams = (query) => {
    const paramArray = query.split('&').map(p => p.split('='));
    const params = paramArray.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {})
    //Object.fromEntries(paramArray);
    return params;
}
module.exports = getUrl;