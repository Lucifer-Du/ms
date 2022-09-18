const express = require('express');
const router = express.Router();
const user = require('../database/user');

router.get('/list', (req, res, next) => {
    user.all(req.query, (err, data) => {
        res.send({
            code: err ? -1 : 1,
            data,
            msg: err ? err.message : ''
        });
    });
});

router.post('/add', (req, res, next) => {
    user.create(req.body, (err, data) => {
        res.send({
            code: err ? -1 : 1,
            msg: err ? err.message : ''
        });
    });
});

router.get('/detail', (req, res, next) => {
    user.find(req.query.id, (err, data) => {
        res.send({
            code: err ? -1 : 1,
            data,
            msg: err ? err.message : ''
        });
    });
});

router.post('/edit', (req, res, next) => {
    user.update(req.body, (err, data) => {
        res.send({
            code: err ? -1 : 1,
            msg: err ? err.message : ''
        });
    });
});

router.post('/delete', (req, res, next) => {
    user.delete({
        'id': req.body.id
    }, (err, data) => {
        res.send({
            code: err ? -1 : 1,
            msg: err ? err.message : ''
        });
    });
});

router.post('/query_account', (req, res, next) => {
    user.query_account({
        'account': req.body.account
    }, (err, result) => {
        res.send({
            code: err ? -1 : 1,
            data: result,
            msg: err ? err.message : ''
        });
    });
});

router.post('/query_userinfo', (req, res, next) => {
    // const { user_id, access } = req.body;
    user.query_userinfo(req.body, (err, result) => {
        res.send({
            code: err ? -1 : 1,
            data: result,
            msg: err ? err.message : ''
        });
    });
});

module.exports = router;
