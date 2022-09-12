const express = require('express');
const router = express.Router();
const user_group = require('../database/user_group');

router.get('/list', (req, res, next) => {
    user_group.all((err, data) => {
        res.send({
            code: err ? -1 : 1,
            data
        });
    });
});

router.post('/add', (req, res, next) => {
    user_group.create({
        'name': req.body.name,
        'role': req.body.role
    }, (err, data) => {
        res.send({
            code: err ? -1 : 1
        });
    });
});

router.get('/detail', (req, res, next) => {
    user_group.find(req.query.id, (err, data) => {
        res.send({
            code: err ? -1 : 1,
            data
        });
    });
});

router.post('/edit', (req, res, next) => {
    user_group.update({
        'id': req.body.id,
        'name': req.body.name,
        'role': req.body.role
    }, (err, data) => {
        res.send({
            code: err ? -1 : 1
        });
    });
});

router.post('/delete', (req, res, next) => {
    user_group.delete(req.body.id, (err, data) => {
        res.send({
            code: err ? -1 : 1
        });
    });
});

module.exports = router;
