------------------------------------
USE
------------------------------------
sh calculated-all.sh [[domain file]] 
Result was in
cd ./result-score-domain 
------------------------------------
Domain file format
------------------------------------
www.cu.ac.th
www.ku.ac.th
...

example in ./domain-file 
-----------------------------------
Field description
-----------------------------------
url,http,code,hsts,https,scode,shsts,CertificateStatus,SignatureStatus,Expired(days),Fingerprint,SSLv2,SSLv3,TLS1,TLS1.1,TLS1.2,TLS1.3,NPN/SPDY,ALPN/HTTP2,$score1,$score2,score3,$score4,score5,score6,domain_grade,total_score
...
...
...
Active-http,Active-https,Inactive-http,Inactive-https,ScoreDomain,Timestamp,havecertificate,nothavecertificate,timestamp,score1,score2,score3,score4,score5,score6,domaingrade,domainscore
