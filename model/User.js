const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a username"],
        minLength: 3,
        maxLength: 25
    },
    email: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
        minLength: 11,
        maxLength: 50
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minLength: 6
    },
    bookList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BookSchema',
        unique: [true, "this book is already in your list"]
    }],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

UserSchema.pre('save', async function () {
    if (!this.isModified('password')){
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePasswords = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
