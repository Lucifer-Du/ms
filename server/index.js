const express = require('express');
const cors = require('cors');
// 用于处理post请求的消息体
const bodyParser = require('body-parser');
const app = express();

const user = require('./api/user');
const access = require('./api/access');
const course = require('./api/course');
const record = require('./api/record');

app.use(cors());
// 使用body-parser,支持编码为json的请求体
app.use(bodyParser.json());
// 支持编码为表单的消息体
app.use(bodyParser.urlencoded({
    extended: true
}))

const port = process.env.PORT || 3002

app.use('/user', user);
app.use('/access', access);
app.use('/course', course);
app.use('/record', record);

app.listen(port, () => {
    console.log(`server susscess localhost:${port}`)
});
