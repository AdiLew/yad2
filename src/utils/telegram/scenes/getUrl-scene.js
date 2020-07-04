const url = require('url');
const Scene = require('telegraf/scenes/base');
const Wizard = require('telegraf/scenes/wizard');
const Stage = require('telegraf/stage');
const User = require('../../../models/user');

const getUrlWizard = new Wizard('GET_URL_WIZARD',
    //Step 1:
    (ctx) => {
        ctx.reply('Send me your search URL, or send "cancel" to cancel the operation.')
        if (typeof ctx.wizard.state === 'undefined') {
            ctx.wizard.state = {}
        };
        return ctx.wizard.next();
    },
    //Step 2: validate input
    async (ctx) => {
        if(ctx.message.text.match(/cancel/gi)){
            ctx.reply('Alright, cancel it is');
            ctx.scene.leave();
        }
        else if (ctx.message.text.match(/^(https?:\/\/)?(www.)?(yad2.co.il)\/realestate\/rent\?[\S]*$/gi)) {
            await ctx.reply('Great!');
            ctx.wizard.state.url = ctx.message.text;
            return ctx.wizard.next();
        } else if (ctx.message.text.match(/^(https?:\/\/)?(www.)?(yad2.co.il)\/realestate(\/(rent(\??))?)?$/gi)) {
            ctx.reply("Great! You're in the realestate page! Now perform your search and then send me the address.");
            return;
        } else if (ctx.message.text.match(/^(https?:\/\/)?(www.)?(yad2.co.il)/gi)) {
            ctx.reply("Yes, that's Yad 2. But I need you to first search and then send me the URL.");
            return;
        } else {
            ctx.reply('Sorry, I don\'t recognize this URL')
            return;
        }
    },
    async (ctx) => {
        //Step 3: Save user filters to DB
        let message;
        const filters = getFiltersFromUrl(ctx.wizard.state.url);
        console.log(filters);
        const user = await User.findOne({ id: ctx.from.id });
        if (user) {
            user.filters = filters;
            try {
                await user.save();
                message = 'Your filters were saved!';
            } catch (error) {
                console.log(error)
                message('There was a problem saving your filters :(');
            }
            ctx.reply(message);
            ctx.scene.leave();
        }
    }
);




/*********************************/
const getUrl = new Scene('getUrl')
getUrl.enter(ctx =>
    ctx.reply('Send me your search URL, or send "cancel" to cancel the operation.')
);

getUrl.leave(ctx =>
    ctx.reply('Alright!')
)

getUrl.hears(/^(https?:\/\/)?(www.)?(yad2.co.il)\/realestate\/rent\?[\S]*$/gi, async (ctx, next) => {
    await ctx.reply('Gotcha. Let me check');
    const filters = getFiltersFromUrl(ctx.message.text)
    const user = await User.findOne({ id: ctx.from.id })
    if (user) {
        user.filters = filters;
        try {
            await user.save()
        } catch (error) {
            console.log(error)
        }
    }
    try {
        const leave = Stage.leave()
        leave(ctx)
    }
    catch (err) {
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
module.exports = {getUrl, getUrlWizard};
