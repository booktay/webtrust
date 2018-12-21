const express = require('express');
const router = express.Router();
const mockAC = require('./mock_ac_th.json');
const mockSCORE = require('./mock_score.json');
const shell = require('shelljs');
var client = require('./connection.js');
var fs = require('fs');

//init all score subdomain
client.indices.create({ index: 'a_subdomain_ac.th' },function(err,resp,status) { if(err) { console.log(err); } else { console.log("create",resp); } });
client.indices.create({ index: 'a_subdomain_co.th' },function(err,resp,status) { if(err) { console.log(err); } else {console.log("create",resp); } });
client.indices.create({ index: 'a_subdomain_net.th' },function(err,resp,status) { if(err) { console.log(err); } else {console.log("create",resp); } });
client.indices.create({ index: 'a_subdomain_or.th' },function(err,resp,status) { if(err) { console.log(err); } else {console.log("create",resp); } });
client.indices.create({ index: 'a_subdomain_mi.th' },function(err,resp,status) { if(err) { console.log(err); } else {console.log("create",resp); } });
client.indices.create({ index: 'a_subdomain_in.th' },function(err,resp,status) { if(err) { console.log(err); } else {console.log("create",resp); } });
client.indices.create({ index: 'a_subdomain_go.th' },function(err,resp,status) { if(err) { console.log(err); } else {console.log("create",resp); } });

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
              shell.exec('/Users/macbook/Downloads/now_used/webtrust_web/server/calculate/calculated-score-domain.sh'+' /Users/macbook/Downloads/now_used/webtrust_web/server/calculate/temp-calculate.csv  ', (code, output) =>     {
		      var result;
           	      result = output.split(",");
		      //console.log(result);
                      client.index({
              		index: req.params.subdomain+"."+req.params.domain,
               		type: 'subdomain',
                	body: {
				"active_http" : result[0],
				"active_https": result[1],
				"inactive_http": result[2],
				"inactive_https": result[3],
				"count_certificate": result[4],
				"count_no_certificate": result[5],
				"DATE_WITH_TIME_f": result[6],
				"score1": result[7],
				"score2": result[8],
				"score3": result[9],
				"score4": result[10],
				"score5": result[11],
				"score6": result[12],
				"domain_grade": result[13],
				"total_score" : result[14],
				"count_code_100_http" : result[15],
				"count_code_200_http" : result[16],
				"count_code_300_http" : result[17],
				"count_code_400_http" : result[18],
				"count_code_500_http" : result[19],
				"count_code_other_http" : result[20],
				"count_code_100_https" : result[21],
				"count_code_200_https" : result[22],
				"count_code_300_https" : result[23],
				"count_code_400_https" : result[24],
				"count_code_500_https" : result[25],
				"count_code_other_https" : result[26],
				"count_tls1_2" : result[27],
				"count_tls1_3" : result[28],
				"count_tls1_1_temp" : result[29],
				"count_sslv3" : result[30],
				"count_tls1" : result[31],
				"count_sslv2_temp" : result[32],
				"count_other_protocol" : result[33]
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
		type: 'web-subdomain',
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

router.get('/score/all/:subdomain/:domain', (req, res) => {
    const testFolder = '/Users/macbook/Downloads/now_used/webtrust_web/server/result-score-domain/';
    const fs = require('fs');
    var calcusum = {
		"active_http" : 0,
                "active_https": 0,
                "inactive_http": 0,
                "inactive_https": 0,
                "count_certificate": 0,
                "count_no_certificate": 0,
                "score1": 0,
                "score2": 0,
                "score3": 0,
                "score4": 0,
                "score5": 0,
                "score6": 0,
                "total_score" : 0,
                "count_code_100_http" : 0,
                "count_code_200_http" : 0,
                "count_code_300_http" : 0,
                "count_code_400_http" : 0,
                "count_code_500_http" : 0,
                "count_code_other_http" : 0,
                "count_code_100_https" : 0,
                "count_code_200_https" : 0,
                "count_code_300_https" : 0,
                "count_code_400_https" : 0,
                "count_code_500_https" : 0,
                "count_code_other_https" : 0,
                "count_tls1_2" : 0,
                "count_tls1_3" : 0,
                "count_tls1_1_temp" : 0,
                "count_sslv3" : 0,
                "count_tls1" : 0,   
                "count_sslv2_temp" : 0,
                "count_other_protocol" : 0
    };
    setTimeout(function(){ fs.readdir(testFolder, (err, files) => {
        files.forEach(file => {
	        result = file.split("-"); 
		domain_name = req.params.subdomain+"."+req.params.domain+".txt";
		if (result[2] == req.params.subdomain+"."+req.params.domain+".txt"){
			fs.readFile('/Users/macbook/Downloads/now_used/webtrust_web/server/result-score-domain/'+file, 'utf8', function(err, data) {
				result = data.split(",");
				//console.log(result)
				calcusum['active_http'] += parseInt(result[0], 10);
				calcusum['active_https'] += parseInt(result[1], 10);
				calcusum['inactive_http'] += parseInt(result[2], 10);
				calcusum['inactive_https'] += parseInt(result[3], 10);
				calcusum['count_certificate'] += parseInt(result[4], 10);
				calcusum['count_no_certificate'] += parseInt(result[5], 10);
				calcusum['score1'] += parseInt(result[7], 10);
				calcusum['score2'] += parseInt(result[8], 10);
				calcusum['score3'] += parseInt(result[9], 10);
				calcusum['score4'] += parseInt(result[10], 10);
				calcusum['score5'] += parseInt(result[11], 10);
				calcusum['score6'] += parseInt(result[12], 10);
				calcusum['total_score'] += parseInt(result[14], 10);
				calcusum['count_code_100_http'] += parseInt(result[15], 10);
				calcusum['count_code_200_http'] += parseInt(result[16], 10);
				calcusum['count_code_300_http'] += parseInt(result[17], 10);
				calcusum['count_code_400_http'] += parseInt(result[18], 10);
				calcusum['count_code_500_http'] += parseInt(result[19], 10);
				calcusum['count_code_other_http'] += parseInt(result[20], 10);
				calcusum['count_code_100_https'] += parseInt(result[21], 10);
				calcusum['count_code_200_https'] += parseInt(result[22], 10);
				calcusum['count_code_300_https'] += parseInt(result[23], 10);
				calcusum['count_code_400_https'] += parseInt(result[24], 10);
				calcusum['count_code_500_https'] += parseInt(result[25], 10);
				calcusum['count_code_other_https'] += parseInt(result[26], 10);
				calcusum['count_tls1_2'] += parseInt(result[27], 10);
				calcusum['count_tls1_3'] += parseInt(result[28], 10);
				calcusum['count_tls1_1_temp'] += parseInt(result[29], 10);
				calcusum['count_sslv3'] += parseInt(result[30], 10);
				calcusum['count_tls1'] += parseInt(result[31], 10);
				calcusum['count_sslv2_temp'] += parseInt(result[32], 10);
				calcusum['count_other_protocol'] += parseInt(result[33], 10);
			});
   		        //console.log(calcusum['active_http']);
		} 

        });
    });}, 5000);
    setTimeout(function(){
	    console.log(calcusum['count_certificate']+calcusum['count_no_certificate']);
            calcusum['score1']=calcusum['score1']/(calcusum['count_certificate']+calcusum['count_no_certificate']);
            calcusum['score2']=calcusum['score2']/(calcusum['count_certificate']+calcusum['count_no_certificate']);
            calcusum['score3']=calcusum['score3']/(calcusum['count_certificate']+calcusum['count_no_certificate']);
            calcusum['score4']=calcusum['score4']/(calcusum['count_certificate']+calcusum['count_no_certificate']);
            calcusum['score5']=calcusum['score5']/(calcusum['count_certificate']+calcusum['count_no_certificate']);
            calcusum['score6']=calcusum['score6']/(calcusum['count_certificate']+calcusum['count_no_certificate']); 
            calcusum['total_score']=calcusum['total_score']/(calcusum['count_certificate']+calcusum['count_no_certificate']);
    },7500);
    setTimeout(function(){  
            client.index({
		  index: 'a_subdomain_'+req.params.subdomain+"."+req.params.domain,
		  type: 'all_score_subdomain',
		  body: {
		"active_http" : calcusum['active_http'],
                "active_https":  calcusum['active_https'],
                "inactive_http":  calcusum['inactive_http'],
                "inactive_https":  calcusum['inactive_https'],
                "count_certificate":  calcusum['count_certificate'],
                "count_no_certificate":  calcusum['count_no_certificate'],
                "score1":  calcusum['score1'],
                "score2": calcusum['score2'],
                "score3":  calcusum['score3'],
                "score4":  calcusum['score4'],
                "score5":  calcusum['score5'],
                "score6":  calcusum['score6'],
                "total_score" :  calcusum['total_score'],
                "count_code_100_http" :  calcusum['count_code_100_http'],
                "count_code_200_http" :  calcusum['count_code_200_http'],
                "count_code_300_http" :  calcusum['count_code_300_http'],
                "count_code_400_http" :  calcusum['count_code_400_http'],
                "count_code_500_http" :  calcusum['count_code_500_http'],
                "count_code_other_http" :  calcusum['count_code_other_http'],
                "count_code_100_https" :  calcusum['count_code_100_https'],
                "count_code_200_https" :  calcusum['count_code_200_https'],
                "count_code_300_https" :  calcusum['count_code_300_https'],
                "count_code_400_https" :  calcusum['count_code_400_https'],
                "count_code_500_https" :  calcusum['count_code_500_https'],
                "count_code_other_https" :  calcusum['count_code_other_https'],
                "count_tls1_2" :  calcusum['count_tls1_2'],
                "count_tls1_3" :  calcusum['count_tls1_3'],
                "count_tls1_1_temp" :  calcusum['count_tls1_1_temp'],
                "count_sslv3" :  calcusum['count_sslv3'],
                "count_tls1" :  calcusum['count_tls1'],
                "count_sslv2_temp" :  calcusum['count_sslv2_temp'],
                "count_other_protocol" : calcusum['count_other_protocol']
	                }
	    },function(err,resp,status) {
    		console.log(resp);
	        res.status(200).json(calcusum);
	    });  
    }, 10000);

});

router.get('/score/cal/:subdomain/:domain', (req, res) => {
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
