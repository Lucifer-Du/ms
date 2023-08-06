const express = require('express');
const router = express.Router();
const user = require('../database/user');

router.post('/login', (request, response, next) => {
    const { account = '', password = '' } = request.body;
    user.query_account({
        account
    }, (err, data) => {
        if (err) {
            response.send({ code: -1, msg: err.message });
            return false;
        }
        if (data) {
            if (data.password == password) {
                const { user_id, user_name, access_id } = data;
                response.send({ code: 1, data: { user_id, user_name, access_id } });
            } else {
                response.send({ code: -1, msg: '密码错误'});
            }
        } else {
            response.send({ code: -1, msg: '用户不存在'});
        }
    });
});

router.get('/list', (request, response, next) => {
    user.all(request.query, (err, data) => {
        if (err) {
            response.send({ code: -1, msg: err.message });
            return false;
        }
        response.send({ code: 1, data });
    });
});

router.post('/add', (request, response, next) => {
    user.create(request.body, (err, data) => {
        if (err) {
            response.send({ code: -1, msg: err.message });
            return false;
        }
        response.send({ code: 1 });
    });
});

router.get('/detail', (request, response, next) => {
    const { id } = request.query;
    if (!id) {
        response.send({ code: -1, msg: '缺少参数id'});
        return false;
    }
    user.find(id, (err, data) => {
        if (err) {
            response.send({ code: -1, msg: err.message });
            return false;
        }
        response.send({ code: 1, data });
    });
});

router.post('/edit', (request, response, next) => {
    user.update(request.body, (err, data) => {
        if (err) {
            response.send({ code: -1, msg: err.message });
            return false;
        }
        response.send({ code: 1 });
    });
});

router.post('/delete', (request, response, next) => {
    const { id } = request.body;
    if (!id) {
        response.send({ code: -1, msg: '缺少参数id'});
        return false;
    }
    user.delete({ id }, (err, data) => {
        if (err) {
            response.send({ code: -1, msg: err.message });
            return false;
        }
        response.send({ code: 1 });
    });
});

router.post('/query_account', (request, response, next) => {
    const { account } = request.body;
    if (!account) {
        response.send({ code: -1, msg: '缺少参数account'});
        return false;
    }
    user.query_account({
        account
    }, (err, data) => {
        if (err) {
            response.send({ code: -1, msg: err.message });
            return false;
        }
        response.send({ code: 1, data });
    });
});

router.post('/query_userinfo', (request, response, next) => {
    user.query_userinfo(request.body, (err, data) => {
        if (err) {
            response.send({ code: -1, msg: err.message });
            return false;
        }
        response.send({ code: 1, data });
    });
});

module.exports = router;
