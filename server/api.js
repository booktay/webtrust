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

// Count
router.get('/count/:index', (req, res) => {
    client.count({index: req.params.index}, function (count) {
        res.send(count);
    });
});

// Search
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

// Add
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
                // Reindex
                id: bulklist.id,
                activehttp: bulklist.activehttp
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

// router.get('/test/score/:website', (req, res) => {
//     shell.exec('./server/calculate/calculated-echo.sh ' + req.params.website + ' </dev/null', (code, output) => {
//         res.send(output)
//     })
// });

module.exports = router;