const express = require('express');
const router = express.Router();
const course = require('../database/course');

router.get('/list', (req, res, next) => {
    course.all(req.query, (err, data) => {
        res.send({
            code: err ? -1 : 1,
            data,
            msg: err ? err.message : ''
        });
    });
});

router.post('/add', (req, res, next) => {
    course.create(req.body, (err, data) => {
        res.send({
            code: err ? -1 : 1,
            msg: err ? err.message : ''
        });
    });
});

router.get('/detail', (req, res, next) => {
    course.find(req.query.id, (err, data) => {
        res.send({
            code: err ? -1 : 1,
            data,
            msg: err ? err.message : ''
        });
    });
});

router.post('/edit', (req, res, next) => {
    course.update(req.body, (err, data) => {
        res.send({
            code: err ? -1 : 1,
            msg: err ? err.message : ''
        });
    });
});

router.post('/delete', (req, res, next) => {
    course.delete({
        'id': req.body.id
    }, (err, data) => {
        res.send({
            code: err ? -1 : 1,
            msg: err ? err.message : ''
        });
    });
});

module.exports = router;
