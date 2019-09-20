var mongoose = require("mongoose");
mongoose.connect('mongodb://47.98.43.2:27017/cw',{
  useCreateIndex:true,
  useNewUrlParser:true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, '连接错误：'))
db.once('open', (callback) => {
  console.log('MongoDB连接成功！！')
})

