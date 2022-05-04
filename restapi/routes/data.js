var express = require('express');
var router = express.Router();
var Data = require('../db/db').data;
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
require('dotenv').config({ path: "../../.env" });

router.get('/', function(req, res, next) {
    Data.findOne({
        order: [
            ['createdAt', 'DESC']
        ],
    }).then(function(reg) {
        res.status(200).json(reg);
    }).catch(error => {
        res.status(500).send(error.message);
    });
});

router.post('/', function(req, res, next) {
    if (!req.body) {
        res.status(400).send('Request body is missing!');
    } else {
        Data.create(req.body).then(function(data) {
            res.status(200).json(data);
        }).catch(error => {
            res.status(500).send(error.message);
        });
    }
});

router.get('/all', function(req, res, next) {
    Data.findAll({}).then(function(regs) {
        res.status(200).json(regs);
    }).catch(error => {
        res.status(500).send(error.message);
    });
});

router.get('/filter/:startdate/:enddate', function(req, res, next) {
    var sti = req.params.startdate;
    var stf = req.params.enddate;

    Data.findAll({
        where: {
            /*createdAt: {
                [Op.between]: [startDate, endDate],
            },*/
            TIMESTAMP: {
                [Op.between]: [sti, stf],
            },
        },
        order: [
            ['createdAt', 'ASC']
        ],
    }).then(function(regs) {
        res.status(200).json(regs);
    }).catch(error => {
        res.status(500).send(error.message);
    });
});

module.exports = router;