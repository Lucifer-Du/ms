const express = require('express');
const router = express.Router();
const user_list = require('../database/user_list');

router.get('/list', (req, res, next) => {
    user_list.all((err, data) => {
        res.send({
            code: err ? -1 : 1,
            data
        });
    });
});

router.post('/add', (req, res, next) => {
    user_list.create(req.body, (err, data) => {
        res.send({
            code: err ? -1 : 1
        });
    });
});

router.get('/detail', (req, res, next) => {
    user_list.find(req.query.id, (err, data) => {
        res.send({
            code: err ? -1 : 1,
            data
        });
    });
});

router.post('/edit', (req, res, next) => {
    user_list.update({
        'id': req.body.id,
        'name': req.body.name
    }, (err, data) => {
        res.send({
            code: err ? -1 : 1
        });
    });
});

router.post('/delete', (req, res, next) => {
    user_list.delete(req.body.id, (err, data) => {
        res.send({
            code: err ? -1 : 1
        });
    });
});

module.exports = router;
