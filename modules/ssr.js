var mongoose = require("mongoose");
const SsrSchema = new mongoose.Schema({
    ssr: String,
    create_time: {
        type:String,
        default: () => moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    },
    miaoshu:String
})
const IpSchema = new mongoose.Schema({
    ip: String,
    user_agent: String,
    access_time: String,
    YMD_access_time:String
})
const BanIpSchema = new mongoose.Schema({
    ip: String,
    create_time: String
})
const Ssr = mongoose.model('ssrclass', SsrSchema) // newClass为创建或选中的集合
const Ip = mongoose.model('ipclass', IpSchema)
const BanIp = mongoose.model('banipclass', BanIpSchema)
// 每次新加字段都需要模型里面插入一条数据才能生效，我也不知道为什么
// ip = BanIp.create({ ip: '127.0.0.1',create_time: '1568962402772' })  
module.exports = {Ssr,Ip,BanIp}