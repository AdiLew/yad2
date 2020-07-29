const User = require('../../../models/user');
const yad2 = require('../utils/yad2Utils');
const { generateInlineCallbackKeyboard } = require('../utils/telegramUtils');

const getApartmentsListCommand = async (ctx, args = {}) => {
    const { isDetailed = false, newAptsOnly = false } = args;

    const { from } = ctx;


    try {
        let user = await User.findOne({ id: from.id });

        if (!user) {
            //Trigger update filters
        }
        else {
            //Get user filters
            const { filters, apartmentsSeen = [] } = user;
            const { apartments } = await yad2.getApartmentsList(filters);
            let newApartmentsViewed = false;
            const validApartments = apartments.filter(apt => {
                if (!apt) return false; // Filter out empty members
                if (!apt.id) return false;
                if (newAptsOnly) {
                    if (apartmentsSeen.includes(apt.id)) {
                        return false;
                    }
                    else {
                        newApartmentsViewed = true;
                        apartmentsSeen.push(apt.id);
                        return true;
                    }
                }
                return true;
            })

            if (validApartments.length === 0) {
                return ctx.reply('לא נמצאו דירות חדשות');
            }

            if (validApartments.length<=5) {
                let allMessages = [];
                validApartments
                    .forEach(apt => {
                        //const buttons = [{ caption: 'נייס!😍', callback: `like_${apt.id}` }, { caption: 'מזעזע 🤢', callback: `dislike_${apt.id}` }];
                        const message = `<a href="${apt.adUrl}">דירת ${apt.Rooms_text} חדרים ב${apt.street} ${apt.address_home_number}</a>: \n`
                            + `${apt.square_meters} מ"ר\n`
                            + `שכר דירה: <b>${apt.price}</b>\n`
                            + `פורסמה ${apt.added}\n`
                            + (apt.street && apt.address_home_number
                                ? `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURI(apt.street)} ${apt.address_home_number} רמת גן">צפייה ב-Google Maps</a>`
                                : '');
                        allMessages.push(ctx.replyWithHTML(message));
                        //allMessages.push(ctx.replyWithHTML(message, generateInlineCallbackKeyboard(buttons))

                    });
                /*await Promise.all(allMessages)
                ctx.reply('זה מה שיש לי כרגע')*/
            }
            else {
                const apartmentListMessage = validApartments
                    .map(apt => {
                        let text = apartmentsSeen.includes(apt.id) ? '' : '✨ '
                        text += `<a href="${apt.adUrl}">דירת ${apt.Rooms_text} חדרים ב${apt.street} ${apt.address_home_number}</a>`
                        return text;
                    }).join('\n');
                const buttons = [{ caption: 'לעמוד הבא', callback: 'nextPage' }, { caption: 'סיימתי', callback: 'abort' }];
                //ctx.replyWithHTML(apartmentListMessage, generateInlineCallbackKeyboard(buttons));
                ctx.replyWithHTML(apartmentListMessage);
            }
            // Save new apartments
            if (newApartmentsViewed) {
                await user.save();
            }
        }

    }
    catch (error) {
        console.log(error);
        ctx.reply('משהו השתבש :(');
    }
};

module.exports = getApartmentsListCommand;