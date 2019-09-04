var mongoose = require("mongoose");
const SsrSchema = new mongoose.Schema({
    ssr: String,
    create_time: {
        type:String,
        default: () => moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    },
    miaoshu:String
})
// 创建model
const Ssr = mongoose.model('ssrclass', SsrSchema) // newClass为创建或选中的集合

module.exports = Ssr