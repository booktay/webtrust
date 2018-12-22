const express = require('express');
const router = express.Router();

// Run script
var client = require('./connection.js');
var fs = require('fs');
const shell = require('shelljs');
shell.cd('./public/calculate')

// Elastic search
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

router.get('/score/:url', async (req, res) => {
    const url = req.params.url

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
    data['GRADE'] = [score, grade];

    return res.status(200).json(data);
});

router.get('/score/:domain/:subdomain', async (req, res) => {
    shell.cd("..")
    const mockWebdomain = require(`./file/domain/${req.params.domain}/${req.params.subdomain}.json`);
    console.log(mockWebdomain)
});
module.exports = router;