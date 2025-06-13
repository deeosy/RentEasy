const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    resetPasswordToken: {type: String, default: null},
    resetPasswordExpires: {type: Date, default: null}
})

const UserModel = mongoose.model('users', UserSchema)

module.exports = UserModel