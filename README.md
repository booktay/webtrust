# Trusted Web Domain Analysis based on SSL TLS

## ADD api on test

### /score/inputfile/:subdomain/:domain
* /score/inputfile/ac/th
  * use file ./inputfile_txt/webdomain_ac_th.txt
* put score domain on es
  * index : ac.th
  * type : "subdomain"
* create csv file on /Users/macbook/Downloads/now_used/webtrust_web/result-score-domain
* return domain score on web

## /score/website/:url
* put score per web to es
  * index : ac.th
  * type : 'web-subdomain'

## /score/:subdomain/:domain
* calculate domain score from json mock
* return domain score on web

