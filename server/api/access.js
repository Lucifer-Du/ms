const express = require('express');
const router = express.Router();
const access = require('../database/access');

router.get('/list', (req, res, next) => {
    access.all(req.query, (err, data) => {
        res.send({
            code: err ? -1 : 1,
            data,
            msg: err ? err.message : ''
        });
    });
});

router.post('/add', (req, res, next) => {
    access.create(req.body, (err, data) => {
        res.send({
            code: err ? -1 : 1,
            msg: err ? err.message : ''
        });
    });
});

router.get('/detail', (req, res, next) => {
    access.find(req.query.id, (err, data) => {
        res.send({
            code: err ? -1 : 1,
            data,
            msg: err ? err.message : ''
        });
    });
});

router.post('/edit', (req, res, next) => {
    access.update(req.body, (err, data) => {
        res.send({
            code: err ? -1 : 1,
            msg: err ? err.message : ''
        });
    });
});

router.post('/delete', (req, res, next) => {
    access.delete({
        'id': req.body.id
    }, (err, data) => {
        res.send({
            code: err ? -1 : 1,
            msg: err ? err.message : ''
        });
    });
});

module.exports = router;
