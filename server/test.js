const express = require('express');
const router = express.Router();
const mockAC = require('./mock_ac_th.json');
const mockSCORE = require('./mock_score.json');
const shell = require('shelljs');
var client = require('./connection.js');

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

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });
        //console.log(result);
        return result;
}

function downloadCSV(args,res) {
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
	fs.writeFile("/Users/macbook/Downloads/now_used/webtrust_web/server/calculate/"+args.filename, csv, function(err) {
    	if(err) {
       		 return console.log(err);
    	}
    	//console.log("The file was saved!");
}); 
}

client.indices.create({
  index: 'ac.th'
},function(err,resp,status) {
  if(err) {
    console.log(err);
  }
  else {
    console.log("create",resp);
  }
});



// Test Part
router.get('/', (req, res) => {
    res.status(200).json({
        status: "Test mode",
        desc: "Status OK",
    })
});

router.get('/score/inputfile/:subdomain/:domain', (req, res) => {
       const fs = require('fs');
       shell.exec('python ./server/csv2json.py ./server/inputfile_txt/webdomain_ac_th.txt  ./server/inputfile_json/webdomain_ac_th.json');
       const mockWebdomain = require('./inputfile_json/webdomain_ac_th.json');
       for (let i in mockWebdomain) {
           shell.exec('/Users/macbook/Downloads/now_used/webtrust_web/server/calculate/calculated-echo.sh ' + mockWebdomain[i].website+ ' 2>/dev/null', (code, output, error, stdout, stderr) => {
                   fs.appendFile("/Users/macbook/Downloads/now_used/webtrust_web/server/calculate/temp-calculate.csv", output, function(err)                    {
                           if(err) {
                               return console.log(err);
                           }
                   });
           });
       }
       setTimeout( function() {
              shell.exec('/Users/macbook/Downloads/now_used/webtrust_web/server/calculate/calculated-score-domain.sh'+' /Users/macbook/Downloads/now_used/webtrust_web/server/calculate/temp-calculate.csv 2>/dev/null', (code, output) =>     {
		      var result;
           	      result = output.split(",");
                      client.index({
              		index: req.params.subdomain+"."+req.params.domain,
               		type: 'subdomain',
                	body: {
				"active_http" : result[0],
				"active_https": result[1],
				"inactive_http": result[2],
				"inactive_https": result[3],
				"domain_grade": result[4],
				"count_certificate": result[5],
				"count_no_certificate": result[6],
				"DATE_WITH_TIME_f": result[7],
				"score1": result[8],
				"score2": result[9],
				"score3": result[10],
				"score4": result[11],
				"score5": result[12],
				"score6": result[13],
				"domain_grade": result[14]
            		}
           	    },function(err,resp,status) {
    	            console.log(resp);
       			    res.send(resp);
   		    });       
		   
              });
       },mockWebdomain.length*12000);
	//res.status(200).json(mockWebdomain[0].website);
});

router.get('/score/website/:url', (req, res) => {
    shell.exec('/Users/macbook/Downloads/now_used/webtrust_web/server/calculate/calculated-echo.sh ' + req.params.url + ' 2>/dev/null', (code, output) => {
            var result;
            result = output.split(",");
            //res.send(result[0]);
	    client.index({
  		index: 'ac.th',
 		//id: '1',
		type: 'subdomain',
		body: {
		  "url": result[0],
		  "http": result[1],
		  "code" : result[2],
		  "hsts" : result[3],
		  "https": result[4],
		  "scode" : result[5],
		  "shsts" : result[6],
		  "CertificateStatus" :  result[7],
		  "SignatureStatus" : result[8],
		  "Expired(days)": result[9],
		  "Fingerprint" : result[10],
		  "SSLv2" : result[11],
		  "SSLv3": result[12],
	          "TLS1": result[13],
		  "TLS1_1": result[14],
		  "TLS1_2": result[15],
		  "TLS1_3": result[16],
		  "NPN/SPDY": result[17],
                  "ALPN/HTTP2": result[18]
  	    }
	   },function(err,resp,status) {
           console.log(resp);
	   res.send(resp);
       });
    });
});

router.get('/score/:subdomain/:domain', (req, res) => {
    const data = require('./mock_'+req.params.subdomain+'_'+req.params.domain+'.json'); 
    const result = convertArrayOfObjectsToCSV({
            data: data
    });
    downloadCSV({
            filename: "temp-test.txt",
	    data: data
    });
    shell.exec('/Users/macbook/Downloads/now_used/webtrust_web/server/calculate/calculated-score-domain.sh'+' /Users/macbook/Downloads/now_used/webtrust_web/server/calculate/temp-test.txt 2>/dev/null', (code, output) =>     {
           res.send(output)
    });
    //res.redirect('/test/score/page/'+req.params.subdomain+'/'+req.params.domain);
});

router.get('/score/page/:subdomain/:domain', (req, res) => {
    shell.exec('/Users/macbook/Downloads/now_used/webtrust_web/server/calculate/calculated-score-domain.sh 2>/dev/null', (code, output) =>     {
           res.send(output)
    });	
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
