const express = require('express');
const cors = require('cors');
// 用于处理post请求的消息体
const bodyParser = require('body-parser');
const app = express();
const user_group = require('./api/user_group');
const user_list = require('./api/user_list');

app.use(cors());
// 使用body-parser,支持编码为json的请求体
app.use(bodyParser.json());
// 支持编码为表单的消息体
app.use(bodyParser.urlencoded({
    extended: true
}))

const port = process.env.PORT || 3002

app.use('/user_group', user_group);
app.use('/user_list', user_list);

app.listen(port, () => {
    console.log(`server susscess localhost:${port}`)
});
