const User = require('../../../models/user')
const startCommand = require('../commands/start-command');

const identifyUser = async (ctx, next) => {
    if (ctx.state && ctx.state.user) {
        return next()
    }
    const user = await User.findOne({ id: ctx.from.id });
    if (!user) {
        await startCommand(ctx);
    }
    ctx.state.user = user;
    user.updateLastUsed();
    return next();
}

module.exports = identifyUser;