const mongoose = require ('mongoose');

const userSchema = new mongoose.Schema({
    id:{
        type: Number,
        required: true,
        unique: true
    },
    userName:{
        type: String,
        trim: true,
        lowercase: true
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    isBot: {
        type: Boolean
    },
    lastUsed:{
        type: Date,
        default: new Date()
    },
    created: {
        type: Date,
        default: new Date()
    },
    filters:{
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    apartmentsSeen:{
        type: [{type: String}]

    }
})

userSchema.methods.updateLastUsed = async function(){
    const user = this;
    user.lastUsed = new Date();
    user.markModified('lastUsed');
    await user.save();
}

// userSchema.statics.findUserbyId = async (userId) => {
//     const user = await this.findOne({userId});
//     return user;
// }

const User = mongoose.model('User', userSchema);

module.exports = User;