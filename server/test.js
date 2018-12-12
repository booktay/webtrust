const express = require('express');
const router = express.Router();
const mockAC = require('./mock_ac_th.json');
const mockSCORE = require('./mock_score.json');

// Test Part
router.get('/', (req, res) => {
    res.status(200).json({
        status: "Test mode",
        desc: "Status OK",
    })
});
// loadDomainOption
router.get('/domain', (req, res) => {
    const data = ['th','us','jp']
    res.status(200).json(data)
});
router.get('/subdomain/:domain', (req, res) => {
    const domain = {
        th: ['ac', 'co', 'in', 'mi', 'go', 'or', 'net'],
        us: ['ac', 'in', 'mi', 'go', 'net'],
        jp: ['ac', 'in', 'mi', 'go'],
    }
    const data = domain[req.params.domain]
    res.status(200).json(data)
});
// Score Data
router.get('/score/subdomain/:domain/:subdomain', (req, res) => {
    for (let i in mockSCORE) {
        if (mockSCORE[i].domain === req.params.domain && mockSCORE[i].subdomain === req.params.subdomain)
            return res.status(200).json(mockSCORE[i])
    }
    res.status(404).send([])
});

router.get('/score/subdomain/:domain/:subdomain/web/count', (req, res) => {
    let count = mockAC.length
    domain = {
        total:Math.ceil(count/10)
    }
    res.status(200).json(domain)
});

router.get('/score/subdomain/:domain/:subdomain/web/:page', (req, res) => {
    let subdomain = mockAC
    data = []
    for (row=10*(req.params.page - 1); row < 10*(req.params.page); row++) {
        data.push(subdomain[row])
    }
    res.status(200).json(data)
});

router.get('/score/:url', (req, res) => {
    for (let i in mockAC) {
        if (mockAC[i].url === req.params.url)
            return res.status(200).json(mockAC[i])
    }
    res.status(404).json([])
});

module.exports = router;