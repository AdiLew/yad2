const Stage = require('telegraf/stage');
const { getUrl, getUrlWizard } = require('../scenes/getUrl-scene');

const stage = new Stage([getUrl, getUrlWizard]);
stage.command('cancel', Stage.leave());

//stage.register(getUrl);
//stage.register(getUrlWizard);

module.exports = stage;