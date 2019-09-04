var mongoose = require("mongoose");
// 创建Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: {
        type: String,
        set(val) {
            return require('bcrypt').hashSync(val, 5)
        }
    }
})
// 创建model
const User = mongoose.model('UsersClass', UserSchema) // newClass为创建或选中的集合

module.exports = User