const User = require('../../../models/user'),
    { generateInlineCallbackKeyboard } = require('../utils/telegramUtils')



const startCommand = async (ctx) => {
    const { from } = ctx
    try {
        let user = await User.findOne({ id: from.id })
        //If the user doesn't exist in the DB, register and greet him.
        if (!user) {
            user = new User({ id: from.id, firstName: from.first_name, lastName: from.last_name, isBot: from.is_bot, userName: from.username, created: new Date() })
            await user.save();
            const buttons = [{ caption: 'Yes I am!', callback: 'setFilters' }, { caption: 'Not really', callback: 'abort' }];
            ctx.reply(`Great to meet you, ${user.firstName}!\nAre you looking for an appartment to rent?`,
                generateInlineCallbackKeyboard(buttons))
        }
        // If the user does exist, just suggest updating the filters
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
}

module.exports = startCommand;