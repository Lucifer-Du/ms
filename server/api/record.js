const express = require('express');
const router = express.Router();
const record = require('../database/record');

router.get('/list', (request, response, next) => {
    record.all(request.query, (err, data) => {
        if (err) {
            response.send({ code: -1, msg: err.message });
            return false;
        }
        response.send({ code: 1, data });
    });
});

router.post('/add', (request, response, next) => {
    record.create(request.body, (err, data) => {
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
    record.find(id, (err, data) => {
        if (err) {
            response.send({ code: -1, msg: err.message });
            return false;
        }
        response.send({ code: 1, data });
    });
});

router.post('/edit', (request, response, next) => {
    record.update(request.body, (err, data) => {
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
    record.delete({ id }, (err, data) => {
        if (err) {
            response.send({ code: -1, msg: err.message });
            return false;
        }
        response.send({ code: 1 });
    });
});

module.exports = router;
