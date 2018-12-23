const express = require('express');
const router = express.Router();

// Run script
// var client = require('./connection.js');
var fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile)
const appendFile = util.promisify(fs.appendFile)
const shell = require('shelljs');
shell.cd('./public/calculate')

async function calculateOne(url, time) {
    var data = {
        "URL": url
    }

    const command_general = {
        "SHSTS": `curl -s -D- https://${url}  --stderr - | grep -i ^Strict | head -n 1 | cut -d ' ' -f 2`,
        "HSTS": `curl -s -D- http://${url}  --stderr - | grep -i ^Strict | head -n 1  | cut -d ' ' -f 2`,
        "SCODE": `curl -I -s https://${url}  --stderr - | head -n 1 | cut -d ' ' -f 2`,
        "CODE": `curl -I -s http://${url}  --stderr - | head -n 1 | cut -d ' ' -f 2`,
    }

    for (let i in command_general) {
        var output = await shell.exec(command_general[i], { silent: true }).stdout;
        data[i] = output.replace(/\s+/g, '')
    }

    data['HTTP'] = ["1", "2", "3"].includes(data['CODE'][0]) ? "yes" : ["4", "5"].includes(data['CODE'][0]) ? "no" : "-";
    data['HTTPS'] = ["1", "2", "3"].includes(data['SCODE'][0]) ? "yes" : ["4", "5"].includes(data['SCODE'][0]) ? "no" : "-";

    data['CERT'] = {
        'STATUS': "-",
        'SIGNATURE': "-",
        'VENDOR': "",
        'EXPIRED': "-",
        'FINGERPRINT': "-"
    };

    if (data['HTTPS'] != "-") {
        var output = await shell.exec(`./ocspcheck/check ${url}`, { silent: true }).stdout;
        var start = output.indexOf("Certificate status:") + "Certificate status:".length;
        const certsts = output.substring(start, output.indexOf("Certificate", start));
        data['CERT']['STATUS'] = certsts.replace(/\s+/g, "");
        var start = output.indexOf("Signature status:") + "Signature status:".length;
        const sigsts = output.indexOf("Signature status:") > 0 ? output.substring(start, output.length) : "no";
        data['CERT']['SIGNATURE'] = sigsts.replace(/\s+/g, "")
        var output = await shell.exec(`./check_ssl_cert/check_ssl_cert -H ${url} --ignore-ocsp --ignore-sig-alg --ignore-ssl-labs-cache `, { silent: true }).stdout;
        const certvendor = output.substring(output.indexOf("from") + "from ".length, output.indexOf(" valid until")).replace(/[']/g, "");
        data['CERT']['VENDOR'] = certvendor != "" ? certvendor : "no";
        const expiredate = output.substring(output.indexOf("valid until") + "valid until ".length, output.indexOf("GMT") + 3);
        const expireday = output.substring(output.indexOf("days=") + "days=".length, output.length - 5).replace(/\s+/g, "");
        data['CERT']['EXPIRED'] = expiredate != "" ? [expiredate, expireday] : ["no", "no"];
        var output = await shell.exec(`timeout -k 4 4 openssl s_client -connect ${url}:443 2>&1 | openssl x509 -fingerprint -noout | cut -d ' ' -f 1`, { silent: true }).stdout;
        data['CERT']['FINGERPRINT'] = output.replace(/\s+/g, '');
    }

    data['PROTOCOL'] = {
        "ALPN/HTTP2": "-",
        "NPN/SPDY": "-",
        "TLS13": "-",
        "TLS12": "-",
        "TLS11": "-",
        "TLS1": "-",
        "SSLv3": "-",
        "SSLv2": "-"
    };

    if (data['HTTPS'] != "-") {
        var output = await shell.exec(`./testssl.sh/testssl.sh -p --parallel --quiet --color 0 ${url}`, { silent: true }).stdout;
        var proctocol = output.substring(output.indexOf("SSLv2"), output.indexOf(" Done", output.indexOf("SSLv2")));
        const WORDSEPERATE = ["ALPN/HTTP2 ", "NPN/SPDY ", "TLS 1.3 ", "TLS 1.2 ", "TLS 1.1 ", "TLS 1 ", "SSLv3 ", "SSLv2 "];
        const KEYS = ["ALPN/HTTP2", "NPN/SPDY", "TLS13", "TLS12", "TLS11", "TLS1", "SSLv3", "SSLv2"];
        for (let i in WORDSEPERATE) {
            data['PROTOCOL'][KEYS[i]] = proctocol.substring(proctocol.indexOf(WORDSEPERATE[i]) + WORDSEPERATE[i].length, proctocol.length).trim();
            proctocol = proctocol.substring(0, proctocol.indexOf(WORDSEPERATE[i]))
        }
    }

    data['TIMESTAMP'] = time

    //Scoring
    var score = 0;
    data['SCORE'] = [];

    var count_active_http = data['HTTP'] == "yes" ? 4 : 0,
        count_active_https = data['HTTPS'] == "yes" ? 6 : 0;
    data['SCORE'][0] = [count_active_http + count_active_https, 10];
    score += parseInt(data['SCORE'][0]);

    var general = 0;
    if (data['HTTPS'] == "yes") {
        general = 5;
        if (["1", "2"].includes(data['CODE'][0])) {
            general = data['SHSTS'] == "" ? 10 : 20;
        } else if (["3"].includes(data['CODE'][0])) {
            general = data['SHSTS'] == "" ? 15 : 20;
        } else if (["4", "5"].includes(data['CODE'][0])) {
            general = data['SHSTS'] == "" ? 10 : 20;
        }
    }
    data['SCORE'][1] = [general, 20];
    score += parseInt(data['SCORE'][1]);

    var count_u_revoke = data['CERT']['STATUS'] == "good" ? 10 : 0;
    data['SCORE'][2] = [count_u_revoke, 10];
    score += parseInt(data['SCORE'][2]);

    var day = data['CERT']['EXPIRED'][1] >= 30 ? 10 : data['CERT']['EXPIRED'][1] >= 7 ? 5 : data['CERT']['EXPIRED'][1] > 0 ? 2.5 : 0;
    data['SCORE'][3] = [day, 10]
    score += parseInt(data['SCORE'][3]);

    var count_valid = data['CERT']['SIGNATURE'] == "OK" ? 10 : 0;
    data['SCORE'][4] = [count_valid, 10];
    score += parseInt(data['SCORE'][4]);

    var proto_col = 0;
    if (data['PROTOCOL']['SSLv2'] == "not offered (OK)") proto_col += 10;
    if (data['PROTOCOL']['SSLv3'] == "not offered (OK)") proto_col += 10;
    if (data['PROTOCOL']['TLS1'] == "offered") proto_col += 5;
    if (data['PROTOCOL']['TLS11'] == "offered") proto_col += 5;
    if (data['PROTOCOL']['TLS12'] == "offered (OK)") proto_col += 10;
    // else if (data['PROTOCOL']['TLS13'] == "offered (OK)") proto_col += 10;
    data['SCORE'][5] = [proto_col, 40]
    score += parseInt(data['SCORE'][5]);

    // Calculate Grade
    var grade = "f";
    if (score >= 70) grade = "a"
    else if (score >= 60) grade = "b+"
    else if (score >= 50) grade = "b"
    else if (score >= 40) grade = "c+"
    else if (score >= 30) grade = "c"
    else if (score >= 20) grade = "d"
    data['GRADE'] = [score.toString(), grade];
    return data;
}

// Elastic search
router.get('/elasticsearch', (req, res) => {
    res.status(500).send('Elasticsearch Close!!');
    // client.ping({
    //     requestTimeout: 1000
    // }, function (error) {
    //     if (error) {
    //         return res.status(500).send('Elasticsearch is Down!!!');
    //     } else {
    //         res.status(200).send('Elasticsearch OK!!');
    //     }
    // });
});

router.get('/score/url/:url', async (req, res) => {
    const url = req.params.url;
    const time = Date.now();
    const data = await calculateOne(url, time);
    // await appendFile(`../file/result/url/${url}.url.json`, JSON.stringify([data]), 'utf-8');
    // console.log("calculated")
    return res.json(data);
});

router.get('/score/name/:name/:file/:add', async (req, res) => {
    const data = await readFile(`../file/domain/${req.params.file}.json`);
    const webdomain = JSON.parse(data);

    const time = Date.now();

    const limit = 49;
    var start = 0, score = 0;
    const n = webdomain.length < limit ? webdomain.length : limit;

    const domainInfo = {
        "url": [],
        "activehttp": 0,
        "inactivehttp": 0,
        "activehttps": 0,
        "inactivehttps": 0,
        "havecertificate": 0,
        "nothavecertificate": 0,
        "code": { "other": 0 },
        "scode": { "other": 0 },
        "protocol": {},
        "timestamp": "",
        "score": [0, 0, 0, 0, 0, 0],
        "grade": [0, "D"]
    };

    var dataall = [];
    for (let web in webdomain) {
        var dataCal = await calculateOne(webdomain[web], time);
        domainInfo['url'].push(webdomain[web])
        if (["1", "2", "3"].includes(dataCal['CODE'][0])) domainInfo['activehttp'] += 1;
        else domainInfo['inactivehttp'] += 1;
        if (["1", "2", "3"].includes(dataCal['SCODE'][0])) domainInfo['activehttps'] += 1;
        else domainInfo['inactivehttps'] += 1;
        if (dataCal['CERT']['STATUS'] != "-") domainInfo['havecertificate'] += 1;
        else domainInfo['nothavecertificate'] += 1;
        if (dataCal['CODE'][0] != undefined) {
            if (domainInfo['code'][dataCal['CODE'][0] + "00"]) domainInfo['code'][dataCal['CODE'][0] + "00"] += 1;
            else domainInfo['code'][dataCal['CODE'][0] + "00"] = 1;
        }
        else domainInfo['code']["other"] += 1;
        if (dataCal['SCODE'][0] != undefined) {
            if (domainInfo['scode'][dataCal['SCODE'][0] + "00"]) domainInfo['scode'][dataCal['SCODE'][0] + "00"] += 1;
            else domainInfo['scode'][dataCal['SCODE'][0] + "00"] = 1;
        }
        else domainInfo['scode']["other"] += 1;
        const key_protocol = Object.keys(dataCal['PROTOCOL']);
        for (let k in key_protocol) {
            if (k > 1 && ["offered", "offered (OK)"].includes(dataCal['PROTOCOL'][key_protocol[k]])) {
                if (domainInfo['protocol'][key_protocol[k]]) domainInfo['protocol'][key_protocol[k]] += 1;
                else domainInfo['protocol'][key_protocol[k]] = 1;
                break;
            }
        }
        domainInfo['timestamp'] = time;
        for (let i in dataCal['SCORE']) {
            domainInfo['score'][i] += dataCal['SCORE'][i][0] / (n + 1);
            score += dataCal['SCORE'][i][0] / (n + 1);
        };
        console.log(webdomain[web])

        if (req.params.add == "es") {
            client.index({
                index: webdomain[web],
                type: req.params.name + 'url',
                body: dataCal
            }, function (err, resp, status) {
                console.log(status)
            });
        }
        else if (req.params.add == "file") {
            dataall.push(dataCal)
        }
        if (start == limit) break;
        else start += 1;

    }

    var grade = "f";
    if (score >= 70) grade = "a"
    else if (score >= 60) grade = "b+"
    else if (score >= 50) grade = "b"
    else if (score >= 40) grade = "c+"
    else if (score >= 30) grade = "c"
    else if (score >= 20) grade = "d"
    domainInfo['grade'] = [score.toString(), grade];

    console.log("Complete wait for write")
    if (req.params.add == "add") {
        client.index({
            index: "th",
            type: req.params.name + 'domain',
            body: domainInfo
        }, function (err, resp, status) {
            return res.send(resp)
        });
    }
    else if (req.params.add == "file") {
        await appendFile(`../file/result/${req.params.file}.url.${time}.json`, JSON.stringify(dataall), 'utf-8');
        await appendFile(`../file/result/${req.params.file}.subdomain.${time}.json`, JSON.stringify(domainInfo), 'utf-8');
        return res.json(domainInfo)
    }
    else {
        return res.json(domainInfo)
    }
});

router.get('/score/subdomain/:domain/:subdomain/:add', async (req, res) => {
    const data = await readFile(`../file/domain/${req.params.domain}/${req.params.subdomain}.json`);
    const webdomain = JSON.parse(data);

    const time = Date.now();

    const limit = 29;
    const n = webdomain.length < limit ? webdomain.length : limit;
    var start = 0, score = 0;

    const domainInfo = {
        "domain": req.params.domain,
        "subdomain": req.params.subdomain,
        "url": [],
        "activehttp": 0,
        "inactivehttp": 0,
        "activehttps": 0,
        "inactivehttps": 0,
        "havecertificate": 0,
        "nothavecertificate": 0,
        "code": { "other": 0 },
        "scode": { "other": 0 },
        "protocol": {},
        "timestamp": "",
        "score": [0, 0, 0, 0, 0, 0],
        "grade": [0, "D"]
    };

    var dataall = [];
    for (let web in webdomain) {
        var dataCal = await calculateOne(webdomain[web], data);
        domainInfo['url'].push(webdomain[web])
        if (["1", "2", "3"].includes(dataCal['CODE'][0])) domainInfo['activehttp'] += 1;
        else domainInfo['inactivehttp'] += 1;
        if (["1", "2", "3"].includes(dataCal['SCODE'][0])) domainInfo['activehttps'] += 1;
        else domainInfo['inactivehttps'] += 1;
        if (dataCal['CERT']['STATUS'] != "-") domainInfo['havecertificate'] += 1;
        else domainInfo['nothavecertificate'] += 1;
        if (dataCal['CODE'][0] != undefined) {
            if (domainInfo['code'][dataCal['CODE'][0] + "00"]) domainInfo['code'][dataCal['CODE'][0] + "00"] += 1;
            else domainInfo['code'][dataCal['CODE'][0] + "00"] = 1;
        }
        else domainInfo['code']["other"] += 1;
        if (dataCal['SCODE'][0] != undefined) {
            if (domainInfo['scode'][dataCal['SCODE'][0] + "00"]) domainInfo['scode'][dataCal['SCODE'][0] + "00"] += 1;
            else domainInfo['scode'][dataCal['SCODE'][0] + "00"] = 1;
        }
        else domainInfo['scode']["other"] += 1;
        const key_protocol = Object.keys(dataCal['PROTOCOL']);
        for (let k in key_protocol) {
            if (k > 1 && ["offered", "offered (OK)"].includes(dataCal['PROTOCOL'][key_protocol[k]])) {
                if (domainInfo['protocol'][key_protocol[k]]) domainInfo['protocol'][key_protocol[k]] += 1;
                else domainInfo['protocol'][key_protocol[k]] = 1;
                break;
            }
        }
        domainInfo['timestamp'] = time;
        for (let i in dataCal['SCORE']) {
            domainInfo['score'][i] += dataCal['SCORE'][i][0] / (n + 1);
            score += dataCal['SCORE'][i][0] / (n + 1);
        };
        console.log(webdomain[web])

        if (req.params.add == "es") {
            client.index({
                index: webdomain[web],
                type: 'url',
                body: dataCal
            }, function (err, resp, status) {
                console.log(status)
            });
        }
        else if (req.params.add == "file") {
            dataall.push(dataCal)
        }
        if (start == limit) break;
        else start += 1;

    }

    var grade = "f";
    if (score >= 70) grade = "a"
    else if (score >= 60) grade = "b+"
    else if (score >= 50) grade = "b"
    else if (score >= 40) grade = "c+"
    else if (score >= 30) grade = "c"
    else if (score >= 20) grade = "d"
    domainInfo['grade'] = [score.toString(), grade];

    console.log("Complete wait for write")
    if (req.params.add == "es") {
        client.index({
            index: req.params.domain + "" + req.params.subdomain,
            type: 'subdomain',
            body: domainInfo
        }, function (err, resp, status) {
            return res.send(resp)
        });
    }
    else if (req.params.add == "file") {
        await appendFile(`../file/result/${req.params.subdomain + req.params.domain}.url.${time}.json`, JSON.stringify(dataall), 'utf-8');
        await appendFile(`../file/result/${req.params.subdomain + req.params.domain}.subdomain.${time}.json`, JSON.stringify(domainInfo), 'utf-8');
        return res.json(domainInfo)
    }
    else {
        return res.json(domainInfo)
    }

});

router.get('/score/bypass/:name', async (req, res) => {
    const data = await readFile(`../file/result/${req.params.name}.url.json`);
    const webdomain = JSON.parse(data);
    const time = Date.now();

    var score = 0;

    const domainInfo = {
        "domain": req.params.domain,
        "subdomain": req.params.subdomain,
        "url": [],
        "activehttp": 0,
        "inactivehttp": 0,
        "activehttps": 0,
        "inactivehttps": 0,
        "havecertificate": 0,
        "nothavecertificate": 0,
        "code": { "other": 0 },
        "scode": { "other": 0 },
        "protocol": {},
        "timestamp": "",
        "score": [0, 0, 0, 0, 0, 0],
        "grade": [0, "D"]
    };

    for (let web in webdomain) {
        var dataCal = webdomain[web]
        domainInfo['url'].push(webdomain[web])
        if (["1", "2", "3"].includes(dataCal['CODE'][0])) domainInfo['activehttp'] += 1;
        else domainInfo['inactivehttp'] += 1;
        if (["1", "2", "3"].includes(dataCal['SCODE'][0])) domainInfo['activehttps'] += 1;
        else domainInfo['inactivehttps'] += 1;
        if (dataCal['CERT']['STATUS'] != "-") domainInfo['havecertificate'] += 1;
        else domainInfo['nothavecertificate'] += 1;
        if (dataCal['CODE'][0] != undefined) {
            if (domainInfo['code'][dataCal['CODE'][0] + "00"]) domainInfo['code'][dataCal['CODE'][0] + "00"] += 1;
            else domainInfo['code'][dataCal['CODE'][0] + "00"] = 1;
        }
        else domainInfo['code']["other"] += 1;
        if (dataCal['SCODE'][0] != undefined) {
            if (domainInfo['scode'][dataCal['SCODE'][0] + "00"]) domainInfo['scode'][dataCal['SCODE'][0] + "00"] += 1;
            else domainInfo['scode'][dataCal['SCODE'][0] + "00"] = 1;
        }
        else domainInfo['scode']["other"] += 1;
        const key_protocol = Object.keys(dataCal['PROTOCOL']);
        for (let k in key_protocol) {
            if (k > 1 && ["offered", "offered (OK)"].includes(dataCal['PROTOCOL'][key_protocol[k]])) {
                if (domainInfo['protocol'][key_protocol[k]]) domainInfo['protocol'][key_protocol[k]] += 1;
                else domainInfo['protocol'][key_protocol[k]] = 1;
                break;
            }
        }
        domainInfo['timestamp'] = time;
        for (let i in dataCal['SCORE']) {
            domainInfo['score'][i] += dataCal['SCORE'][i][0] / webdomain.length;
            score += dataCal['SCORE'][i][0] / webdomain.length;
        };

    }

    var grade = "f";
    if (score >= 70) grade = "a"
    else if (score >= 60) grade = "b+"
    else if (score >= 50) grade = "b"
    else if (score >= 40) grade = "c+"
    else if (score >= 30) grade = "c"
    else if (score >= 20) grade = "d"
    domainInfo['grade'] = [score.toString(), grade];

    console.log("Complete wait for write")
    await appendFile(`../file/result/${req.params.name}.subdomain.${time}.json`, JSON.stringify(domainInfo), 'utf-8');
    return res.json(domainInfo)

});

router.get('/search', (req, res) => {
    res.status(200).json({
        mode: "Search",
    })
});

router.get('/search/domain', (req, res) => {
    const data = ['th']
    res.status(200).json(data)
});

router.get('/search/subdomain/:domain', (req, res) => {
    const domain = {
        th: ['ac', 'co', 'in', 'mi', 'go', 'or', 'net']
    }
    const data = domain[req.params.domain]
    res.status(200).json(data)
});

router.get('/search/score/subdomain/:domain/:subdomain', async (req, res) => {
    const data1 = await readFile(`../file/result/${req.params.subdomain}${req.params.domain}.subdomain.json`);
    const webdomain = JSON.parse(data1);

    if (webdomain) {
        return res.status(200).json(webdomain);
    }
    res.status(404).send([])
});

router.get('/search/score/subdomain/:domain/:subdomain/url/:page', async (req, res) => {
    const data2 = await readFile(`../file/result/${req.params.subdomain}${req.params.domain}.url.json`);
    const webdata = JSON.parse(data2);
    data = []
    for (row = 10 * (req.params.page - 1); row < 10 * (req.params.page); row++) {
        if (webdata[row]) data.push(webdata[row])
    }
    res.status(200).json(data)
});

router.get('/search/score/name/:name', async (req, res) => {
    const data1 = await readFile(`../file/result/${req.params.name}.subdomain.json`);
    const webdomain = JSON.parse(data1);

    if (webdomain) {
        return res.status(200).json(webdomain);
    }
    res.status(404).send([])
});

router.get('/search/score/name/:name/url/:page', async (req, res) => {
    const data2 = await readFile(`../file/result/${req.params.name}.url.json`);
    const webdata = JSON.parse(data2);
    data = []
    for (row = 10 * (req.params.page - 1); row < 10 * (req.params.page); row++) {
        data.push(webdata[row])
    }
    res.status(200).json(data)
});

router.get('/search/th', async (req, res) => {
    const subdomain = ['ac', 'co', 'in', 'mi', 'go', 'or', 'net']
    var webdata = [];
    for (let i in subdomain) {
        var data = await readFile(`../file/result/${subdomain[i]}th.subdomain.json`);
        webdata.push(await JSON.parse(data));
    }
    res.status(200).json(webdata)
});

module.exports = router;