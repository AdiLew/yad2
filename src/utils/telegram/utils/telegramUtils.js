const Extra = require('telegraf/extra'),
    Markup = require('telegraf/markup')

const generateInlineCallbackKeyboard = (buttons = []) => {
    const keyboard = Extra.HTML().markup((m) =>
        m.inlineKeyboard(buttons.map(b => m.callbackButton(b.caption, b.callback || b.caption))));

    return keyboard;
}

module.exports = {
    generateInlineCallbackKeyboard
}