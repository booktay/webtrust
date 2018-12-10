const express = require('express');
const router = express.Router();

// run Shell script
const shell = require('shelljs');

// Elastic search
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

router.get('/elasticsearch', (req, res) => {
    client.ping({
        requestTimeout: 1000
    }, function (error) {
        if (error) {
            return res.status(500).send('Elasticsearch is Down!!!');
        } else {
            res.status(200).send('Elasticsearch OK!!');
        }
    });
});

router.get('/count/:index', (req, res) => {
    client.count({index: req.params.index}, function (count) {
        res.send(count);
    });
});

router.get('/score/:domain/:subdomain/', (req, res) => {
    client.search({
        index: 'score',
        type: req.params.domain,
        body: {
            query: {
                match: {
                    subdomain: req.params.subdomain
                }
            }
        }
    }).then(function (resp) {
        res.send(resp.hits.hits);
    }, function (err) {
        res.send(err.message);
    });
});

router.get('/add/score/:domain/:subdomain/', (req, res) => {
    var bulk = [];
    
    var makebulk = function (bulklist, callback) {
        for (var current in bulklist) {
            bulk.push({
                index: {
                    _index: 'score',
                    _type: req.params.domain,
                    _id: current
                }
            }, {
                'constituencyname': bulklist[current].ConstituencyName,
                'constituencyID': bulklist[current].ConstituencyID
            });
        }
        callback(bulk);
    }

    var indexall = function (madebulk, callback) {
        client.bulk({
            maxRetries: 5,
            index: 'score',
            type: req.params.domain,
            body: madebulk
        }, function (err, resp, status) {
            if (err) {
                console.log(err);
            } else {
                callback(resp.items);
            }
        })
    }

    shell.exec('./calculate/calculated-echo.sh' + url + '</dev/null', (code, output) => {
        console.log(output)
    })

    var inputfile = []

    makebulk(inputfile, function (response) {
        console.log("Bulk content prepared");
        indexall(response, function (response) {
            console.log(response);
        })
    });
});

router.get('/test/score/:website', (req, res) => {
    shell.exec('./server/calculate/calculated-echo.sh ' + req.params.website + ' </dev/null', (code, output) => {
        res.send(output)
    })
});

// Test Part
router.get('/test/domain', (req, res) => {
    res.json({
        th: ['ac', 'co', 'in', 'mi', 'go', 'or', 'net']
    })
});

module.exports = router;