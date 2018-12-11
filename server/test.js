const express = require('express');
const router = express.Router();

// Test Part
router.get('/', (req, res) => {
    res.json({
        status: "Test mode",
        desc: "Status OK",
    })
});
router.get('/domain', (req, res) => {
    res.json({
        th: ['ac', 'co', 'in', 'mi', 'go', 'or', 'net'],
        jp: ['in', 'mi', 'go'],
    })
});
router.get('/score/:domain/:subdomain', (req, res) => {
    domain = {
        domain: req.params.domain,
        subdomain: req.params.subdomain,
        id: 1,
        activehttp: "10",
        activehttps: "82",
        inactivehttp: "1",
        inactivehttps: "3",
        ScoreDomain: "89",
        Timestamp: "3243248230941",
        havecertificate: "20",
        nothavecertificate: "10",
        timestamp: "12432143424",
        score1: "12",
        score2: "23",
        score3: "22",
        score4: "11",
        score5: "42",
        score6: "22",
        domaingrade: "C+",
        domainscore: "50",
    }
    subdomain = [{
            url: "www.ku.ac.th",
            http: "yes",
            code: "300",
            hsts: "no",
            https: "yes",
            scode: "200",
            shsts: "yes",
            CertificateStatus: "good",
            SignatureStatus: "sha",
            Expired: "82",
            Fingerprint: "sha1",
            SSLv2: "yes",
            SSLv3: "no",
            TLS1: "no",
            TLS11: "yes",
            TLS12: "yes",
            TLS13: "yes",
            NPNSPDY: "yes",
            ALPNHTTP2: "1.1",
            score1: "21",
            score2: "11",
            score3: "22",
            score4: "11",
            score5: "26",
            score6: "57",
            domain_grade: "B+",
            total_score: "70"
        },
        {
            url: "www.chula.ac.th",
            http: "yes",
            code: "300",
            hsts: "no",
            https: "yes",
            scode: "200",
            shsts: "yes",
            CertificateStatus: "good",
            SignatureStatus: "sha",
            Expired: "82",
            Fingerprint: "sha1",
            SSLv2: "yes",
            SSLv3: "no",
            TLS1: "no",
            TLS11: "yes",
            TLS12: "yes",
            TLS13: "yes",
            NPNSPDY: "yes",
            ALPNHTTP2: "1.1",
            score1: "21",
            score2: "11",
            score3: "22",
            score4: "11",
            score5: "26",
            score6: "57",
            domain_grade: "B+",
            total_score: "70"
        },
    ]
    res.json([domain, subdomain])
});
router.get('/url/:url', (req, res) => {
    res.json({
        url: req.params.url,
        http: "yes",
        code: "300",
        hsts: "no",
        https: "yes",
        scode: "200",
        shsts: "yes",
        CertificateStatus: "good",
        SignatureStatus: "sha",
        Expired: "82",
        Fingerprint: "sha1",
        SSLv2: "yes",
        SSLv3: "no",
        TLS1: "no",
        TLS11: "yes",
        TLS12: "yes",
        TLS13: "yes",
        NPNSPDY: "yes",
        ALPNHTTP2: "1.1",
        score1: "21",
        score2: "11",
        score3: "22",
        score4: "11",
        score5: "26",
        score6: "57",
        domain_grade: "B+",
        total_score: "70"
    })
});

module.exports = router;