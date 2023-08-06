const express = require('express');
const router = express.Router();
const course = require('../database/course');

router.get('/list', (request, response, next) => {
    course.all(request.query, (err, data) => {
        if (err) {
            response.send({ code: -1, msg: err.message });
            return false;
        }
        response.send({ code: 1, data });
    });
});

router.post('/add', (request, response, next) => {
    course.create(request.body, (err, data) => {
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
    course.find(id, (err, data) => {
        if (err) {
            response.send({ code: -1, msg: err.message });
            return false;
        }
        response.send({ code: 1, data });
    });
});

router.post('/edit', (request, response, next) => {
    course.update(request.body, (err, data) => {
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
    course.delete({ id }, (err, data) => {
        if (err) {
            response.send({ code: -1, msg: err.message });
            return false;
        }
        response.send({ code: 1 });
    });
});

module.exports = router;
