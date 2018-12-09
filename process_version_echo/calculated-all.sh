#echo "url,http,code,hsts,https,scode,shsts,CertificateStatus,SignatureStatus,Expired(days),Fingerprint,SSLv2,SSLv3,TLS1,TLS1.1,TLS1.2,TLS1.3,NPN/SPDY,ALPN/HTTP2" >> v2_test.txt
if [[ ! -e ./ocspcheck ]]; then
    git clone https://github.com/kisom/ocspcheck
    cd ocspcheck
    go get -u golang.org/x/crypto/ocsp
    go build check.go 
fi
if [[ ! -e ./testssl.sh ]]; then
    git clone https://github.com/drwetter/testssl.sh
fi
if [[ ! -e ./check_ssl_cert ]]; then
    git clone https://github.com/matteocorti/check_ssl_cert
fi

domain_file=$1
while read -r p; do
        #echo $p
	sh ./calculated-echo.sh $p  </dev/null
done < $domain_file
sh calculated-score-domain.sh 
