const express = require('express');
const router = express.Router();
const access = require('../database/access');

router.get('/list', (request, response, next) => {
    access.all(request.query, (err, data) => {
        if (err) {
            response.send({ code: -1, msg: err.message });
            return false;
        }
        response.send({ code: 1, data });
    });
});

router.post('/add', (request, response, next) => {
    access.create(request.body, (err, data) => {
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
    access.find(id, (err, data) => {
        if (err) {
            response.send({ code: -1, msg: err.message });
            return false;
        }
        response.send({ code: 1, data });
    });
});

router.post('/edit', (request, response, next) => {
    access.update(request.body, (err, data) => {
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
    access.delete({ id }, (err, data) => {
        if (err) {
            response.send({ code: -1, msg: err.message });
            return false;
        }
        response.send({ code: 1 });
    });
});

module.exports = router;
