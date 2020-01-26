const Stage = require('telegraf/stage'),
    getUrl = require('../scenes/getUrl-scene')

const stage = new Stage()
stage.command('cancel', Stage.leave())





stage.register(getUrl)

module.exports = stage;