const express = require('express');
const router = express.Router();

// Run script
var client = require('./connection.js');
var fs = require('fs');
const shell = require('shelljs');

function convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function (item) {
        ctr = 0;
        keys.forEach(function (key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });
    //console.log(result);
    return result;
}

function downloadCSV(args, res) {
    var data, filename, link;

    var csv = convertArrayOfObjectsToCSV({
        data: args.data
    });
    if (csv == null) return;

    filename = args.filename || 'export.csv';

    //if (!csv.match(/^data:text\/csv/i)) {
    //    csv = 'data:text/csv;charset=utf-8,' + csv;
    //}
    //data = encodeURI(csv);
    const fs = require('fs');
    fs.writeFile("./calculate/" + args.filename, csv, function (err) {
        if (err) {
            return console.log(err);
        }
        //console.log("The file was saved!");
    });
}

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

router.get('/score/file/:domain/:subdomain', (req, res) => {
    const path = `../public/file/domain/${req.params.domain}/`;
    const mockWebdomain = require(path + `${req.params.subdomain}.json`);

    const path_calculate_file = `./calculate/`
    for (let i = 0; i < 10; i++) {
        shell.exec(path_calculate_file + 'calculated-echo.sh ' + mockWebdomain[i] + ' 2>/dev/null', (code, output, error, stdout, stderr) => {
            fs.appendFile(path_calculate_file + "temp-calculate.csv", output, function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        });
    }

    setTimeout(function () {
        shell.exec(path_calculate_file + 'calculated-score-domain.sh ' + path_calculate_file + 'temp-calculate.csv  ', (code, output) => {
            var result;
            result = output.split(",");
            console.log(result);
            // client.index({
            //     index: req.params.subdomain + "." + req.params.domain,
            //     type: 'subdomain',
            //     body: {
            //         "active_http": result[0],
            //         "active_https": result[1],
            //         "inactive_http": result[2],
            //         "inactive_https": result[3],
            //         "count_certificate": result[4],
            //         "count_no_certificate": result[5],
            //         "DATE_WITH_TIME_f": result[6],
            //         "score1": result[7],
            //         "score2": result[8],
            //         "score3": result[9],
            //         "score4": result[10],
            //         "score5": result[11],
            //         "score6": result[12],
            //         "domain_grade": result[13],
            //         "total_score": result[14],
            //         "count_code_100_http": result[15],
            //         "count_code_200_http": result[16],
            //         "count_code_300_http": result[17],
            //         "count_code_400_http": result[18],
            //         "count_code_500_http": result[19],
            //         "count_code_other_http": result[20],
            //         "count_code_100_https": result[21],
            //         "count_code_200_https": result[22],
            //         "count_code_300_https": result[23],
            //         "count_code_400_https": result[24],
            //         "count_code_500_https": result[25],
            //         "count_code_other_https": result[26],
            //         "count_tls1_2": result[27],
            //         "count_tls1_3": result[28],
            //         "count_tls1_1_temp": result[29],
            //         "count_sslv3": result[30],
            //         "count_tls1": result[31],
            //         "count_sslv2_temp": result[32],
            //         "count_other_protocol": result[33]
            //     }
            // }, function (err, resp, status) {
            //     console.log(resp);
            //     res.send(resp);
            // });

        });
    }, mockWebdomain.length * 12000);
    res.status(200).json(mockWebdomain[0].website);
});

module.exports = router;