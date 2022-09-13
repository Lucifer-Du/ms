const express = require('express');
const cors = require('cors');
// 用于处理post请求的消息体
const bodyParser = require('body-parser');
const app = express();
const Articles = require('./database').Articles;
const Users = require('./database_user').Users;

app.use(cors());
// 使用body-parser,支持编码为json的请求体
app.use(bodyParser.json());
// 支持编码为表单的消息体
app.use(bodyParser.urlencoded(
    {
        extended: true
    }
))

const port = process.env.PORT || 3002

// 获取文章列表
app.get('/articles', (req, res, next) => {
    Articles.all((err, articles) => {
        if (err) return next(err);
        res.send(articles)
    })
});

// 创建一篇文章 使用消息体解析
app.post('/articles', (req, res, next) => {
    Articles.create({
        "title": req.body.title ? req.body.title : '',
        "content": req.body.content ? req.body.content : ''
    }, (err, data) => {
        if (err) return next(err);
        res.send('添加成功')
    });
});

app.get('/users', (req, res, next) => {
    Users.all((err, users) => {
        if (err) return next(err);
        res.send(users)
    })
})

app.listen(port, () => {
    console.log(`server susscess localhost:${port}`)
})
