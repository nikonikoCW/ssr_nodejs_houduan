const express = require('express')
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken')
const app = express()
const SCRET = 'myscret'
db = require('./modules/db')
User = require('./modules/user')
let {Ssr,Ip} = require('./modules/ssr')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
const auth = async (req, res, next) => {

    const raw = String(req.headers.authorization).split(' ')[1]

    const { id } = jwt.verify(raw, SCRET)

    // assert(id, 401, 'denglu')

    req.user = await User.findById(id,(err) => {
        if(err){
            res.send('meiyo')
        }
        
    })
    next()


    
}
app.post('/createssr', auth, async (req, res) => {
    const create_info = [{
        ssr: req.body.ssr,
        miaoshu: req.body.miaoshu,
        create_time: req.body.create_time
    }]
    const ssr = await Ssr.create(create_info)
    res.send('已经添加' + String(req.body.miaoshu))
})
app.post('/delete', auth, (req, res) => {
    const delete_id = {
        _id: req.body.id
    }
    const ssr = Ssr.deleteOne(delete_id, function (err) {
        if (err) {
            console.log('3423423')
        }
        res.send('操作已经完成')
    })


})
app.get('/api/ssr', async (req, res) => {
    var myDate = new Date();
    const inserip_info = {
        user_agent: req.headers['user-agent'],
        ip: req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0],
        access_time: String(myDate.toLocaleString())
    }
    const ip = await Ip.create(inserip_info)
    const allssr = await Ssr.find()
    for (var i=0;i<allssr.length;i++) {
        allssr[i]['miaoshu'] = '别爬我，我的站点是公益的'
    }
    res.send(allssr)
})
app.post('/updatessr', auth, (req, res) => {
    const update_id = {
        _id: req.body.id
    }
    const update_info = {
        ssr: req.body.ssr,
        miaoshu: req.body.miaoshu,
        create_time: req.body.create_time
    }
    const data = Ssr.updateOne(update_id, update_info, function (err) {
        if (err) {
            console.log('3423423')
        }
        res.send('操作已经完成')
    })


})

app.post('/register', async (req, res) => {

    const register_info = [
        {
            username: req.body.username,
            password: req.body.password,
            lingpai: req.body.lingpai
        }
    ]
    if (req.body.lingpai != 'chenwei') {
        res.send('注冊成功')
    }else{
        const user = User.create(register_info, (err, doc) => {
            if (err) {
                console.log(err)
                res.send('用户已经存在')
            }
            else {
                const len_password = String(req.body.password)
    
                if (len_password.length < 6) {
                    res.send('请把密码设置6位以上')
                } else {
                    res.send('注册成功')
                }
    
            }
        })
    }
    
});
app.get('/alluser', auth,async(req,res) => {
    const user = await User.find()
    const useranme_list = []
    for(var i=0;i<user.length;i++){
        useranme_list.push(user[i]['username'])
    }
    
    console.log(useranme_list)
    res.send(useranme_list)
})
app.post('/updatepasswd',auth,async(req,res) => {
    const update_user_id = {
        _id: req.body.id
    }
    const update_password_info = {
        password: req.body.password
    }
    const data = User.updateOne(update_user_id, update_password_info, function (err) {
        if (err) {
            console.log('3423423')
        }
        res.send('操作已经完成')
    })
})
app.post('/login', async (req, res) => {
    const user = await User.findOne({
        username: req.body.username
    })
    console.log(user)
    if (!user) {
        return res.status(422).send({
            message: '没有该用户'
        })
    }
    const isPasswordValid = require('bcrypt').compareSync(
        req.body.password,
        user.password
    )

    if (!isPasswordValid) {
        return res.status(422).send({
            message: '密码无效'
        })
    }
    const token_time = 20000
    const token = jwt.sign({ id: user._id }, SCRET, { expiresIn: token_time })
    res.send({
        '用户': user.username,
        token: token,
        time: getNowFormatDate(),
    })

})
// 获取时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate.toString();
}
var datatime = 'public/images/' + getNowFormatDate();
const multer = require('multer')
// 这是自带的加密文件上传
// const upload_file = multer({ dest: 'public/' })
// 这是按照日期分的文件上传
var storage = multer.diskStorage({
    // 如果你提供的 destination 是一个函数，你需要负责创建文件夹
    destination: datatime,
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload_file = multer({
    storage: storage
});
app.post('/upload', upload_file.single('file_image'), async (req, res) => {
    console.log(req.file)
    res.send(req.file)
})

app.listen(8881, () => console.log('Example app listening on port 8881!'))