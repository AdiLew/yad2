const User = require('../../../models/user')
const identifyUser = async (ctx, next) => {
    if (ctx.state && ctx.state.user) {
        return next()
    }
    const user = await User.findOne({ id: ctx.from.id });
    if (!user) {
        //Invoke start
    }
    ctx.state.user = user;
    return next();
}

module.exports = identifyUser;