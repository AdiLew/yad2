const User = require('../../../models/user');
const yad2 = require('../utils/yad2Utils');
const { generateInlineCallbackKeyboard } = require('../utils/telegramUtils');

const getAllApartmentsCommand = async (ctx) => {

    const { from } = ctx;


    try {
        let user = await User.findOne({ id: from.id });

        if (!user) {
            //Trigger update filters
        }
        else {
            //Get user filters
            const { filters } = user;
            const { apartments } = await yad2.getApartmentsList(filters);
            const apartmentListMessage = apartments
                .filter(apt => apt) //Filter out empty members
                .map(apt => {
                    return `<a href="${apt.adUrl}">דירת ${apt.Rooms_text} חדרים ב${apt.street} ${apt.address_home_number}</a>`
                }).join('\n');
            const buttons = [{ caption: 'לעמוד הבא', callback: 'nextPage' }, { caption: 'סיימתי', callback: 'abort' }];
            ctx.replyWithHTML(apartmentListMessage,
                generateInlineCallbackKeyboard(buttons));
        }

    }
    catch (error) {
        console.log(error);
        ctx.reply('משהו השתבש :(');
    }
};


module.exports = getAllApartmentsCommand;