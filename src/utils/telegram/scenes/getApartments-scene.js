const Scene = require('telegraf/scenes/base');
const Stage = require('telegraf/stage');
const User = require('../../../models/user');
const { generateInlineCallbackKeyboard } = require('../utils/telegramUtils');


const getApartments = new Scene('getApartments');

getApartments.enter(ctx => {
    const buttons = [{ caption: 'כל הדירות', callback: 'getAllApartments' }, { caption: 'רק דירות חדשות', callback: 'getNewApartments' }]
    ctx.reply('אילו דירות תרצה לראות?',
        generateInlineCallbackKeyboard(buttons));

})

getApartments.inlineQuery('getAllApartments', () => { });
getApartments.inlineQuery('getNewApartments', () => { });