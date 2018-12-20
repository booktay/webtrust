p=$1

HTTP="no"
HTTPS="no"
HSTS="no"
SHSTS="no"
HSTS="no"
code="no"
scode="no"
c1="no"
c2="no"
expired="no"
fp="no"
protocal_all=""
logProtocol=("yes" "yes" "yes" "yes" "yes" "yes" "yes" "yes")

check_fp () {
     fp=$(timeout -k 4 4 openssl s_client -connect $p:443 |& openssl x509 -fingerprint -noout | cut -d ' ' -f 1 )
}

res=$(curl -I -s http://$p  --stderr - | grep -i "https"); 
if [ "" != "${res}" ]; then HTTPS="yes"; fi;
 
res_3=$(curl -s -D- https://$p  --stderr - | grep -i ^Strict | head -n 1 | cut -d ' ' -f 2); 
if [ "" != "${res_3}" ]; then SHSTS=${res_3}; fi; 

res_3=$(curl -s -D- http://$p  --stderr - | grep -i ^Strict | head -n 1  | cut -d ' ' -f 2); 
if [ "" != "${res_3}" ]; then HSTS=${res_3}; fi; 

res_2=$(curl -I -s https://$p  --stderr - | head -n 1 | cut -d ' ' -f 2);
res=$(curl -I -s http://$p  --stderr - | head -n 1 | cut -d ' ' -f 2);
if [ "" != "${res}" ]; then code=${res}; HTTP="yes"; fi; 
if [ "" != "${res_2}" ]; then scode=${res_2}; HTTPS="yes"; fi; 

word=$p","$HTTP","$code","$HSTS
word2=","$HTTPS","$scode","$SHSTS


if [ $HTTPS != "no" ]
then 
	rm c  2>/dev/null
	if [ $HTTPS != "no" ]; then /Users/macbook/Downloads/now_used/webtrust_web/server/calculate/ocspcheck/ocspcheck $p 2>/dev/null >> c; fi;
	if [ $HTTPS == "no" ]; then echo "HTTPS: not avalible"; fi;
	c1=$(cat c | grep "Certificate status:" | cut -d ' ' -f 3)
	c2=$(cat c | grep "Signature status:" | cut -d ' ' -f 3)
        if [ "$c1" == "" ]; then echo cat c | grep "Certificate status:"; c1="no"; fi;
        if [ "$c2" == "" ]; then echo cat c | grep "Signature status:"; c2="no"; fi;
        if [ "$c2" == "" ] && [ "$c1" == "" ]; then c2="E"; c1="E"; fi;
fi

if [ $HTTPS == "no" ]
then
        c1="-"
        c2="-"
fi

if [ $HTTPS != "no" ]
then
	a=$( /Users/macbook/Downloads/now_used/webtrust_web/server/calculate/check_ssl_cert/check_ssl_cert -H $p --ignore-ocsp --ignore-sig-alg --ignore-ssl-labs-cache )
	a=$(echo $a |  cut -d  '|' -f 2)
	expired=$(echo ${a//;} | cut  -d '=' -f 2) 
        temp_1=$(echo ${expired} |  cut -d ' ' -f 1)
        if [ "${temp_1}"  == "SSL_CERT" ]; then a=$( check_ssl_cert/check_ssl_cert -H $p --ignore-ocsp --ignore-sig-alg --ignore-ssl-labs-cache );  a=$(echo $a |  cut -d  '|' -f 2); expired=$(echo ${a//;} | cut  -d '=' -f 2); fi;
fi

if [ $HTTPS == "no" ]
then
        expired="-"
fi

if [ $HTTPS != "no" ]
then
        j=0
        check_fp;
	fp=$(timeout -k 4 4 openssl s_client -connect $p:443 |& openssl x509 -fingerprint -noout | cut -d ' ' -f 1 )
        if [ "${fp}" == "" ]; then fp=$(timeout -k 4 4 openssl s_client -connect $p:443 |& openssl x509 -fingerprint -noout | cut -d ' ' -f 1 ); fi;
fi

if [ $HTTPS == "no" ]
then
        fp="-"
fi

if [ $HTTPS != "no" ]
then
	logProtocol=("yes" "yes" "yes" "yes" "yes" "yes" "yes" "yes")
	num_temp=0
	rm TXT 2>/dev/null
	/Users/macbook/Downloads/now_used/webtrust_web/server/calculate/testssl.sh/testssl.sh -p --parallel --quiet --color 0 $p >> TXT
	rm c 2>/dev/null
	cat TXT | sed -ne '/ SSLv2/,/ ALPN\/HTTP2/p' >> c
        if [ -z `cat c` ] 2>/dev/null; 
        then 
                /Users/macbook/Downloads/now_used/webtrust_web/server/calculate/testssl.sh/testssl.sh -p --parallel --quiet --color 0 $p >> TXT 2>/dev/null
                cat TXT | sed -ne '/ SSLv2/,/ ALPN\/HTTP2/p' >> c
                if [ -z `cat c` ]; then
                protocal_all="E,E,E,E,E,E,E,E"; 
                fi;
        else
	while read line; do
 		f="yes"
		t1=$(echo $line | cut -d ' ' -f 2)
 		t2=$(echo $line | cut -d ' ' -f 3)
 		if [ "${t1}" == "not" ] || [ "${t2}" == "not" ]; then f="no"; fi;
 		logProtocol[$num_temp]=$f
		num_temp=$(($num_temp+1))
	done<c

	protocal_all=""

	num_temp=0
	for i in "${logProtocol[@]}" 
	do
                if [ "$num_temp" == 8 ]; then break; fi;
   		if [ "$num_temp" == 0 ]; then protocal_all="$i"; fi;
   		if [ "$num_temp" != 0 ]; then protocal_all="$protocal_all,$i"; fi;   
   		num_temp=$(($num_temp+1))
	done

        fi;
fi

if [ $HTTPS == "no" ]
then
	protocal_all="-,-,-,-,-,-,-,-"
fi
rm a.temp 2>/dev/null
result="${word}${word2}" 
echo ${word}${word2} >>a.temp
result="${result},${c1},${c2}"
echo ","${c1}","${c2} >>a.temp   
result="${result},${expired},${fp},"   
echo ","${expired}","${fp}"," >>a.temp  
result="${result}${protocal_all}"  
echo ${protocal_all} >>a.temp
#echo `tr -d "\n\r" < a.temp`

#--------------------------------------------------------------------------#

#clean 
DATE_WITH_TIME_s=`date "+%Y%m%d-%H%M%S"`
rm output.txt output-1.txt temp output-3.txt  output-4.txt temp_2 temp-a 2>/dev/null
#######################INPUT FILE#######################
active_https=""
inactive_https=""
active_http=""
inactive_http=""

#Active-Inactive (10)
echo `tr -d "\n\r" < a.temp` >> temp-a
count_active_http=0
count_active_https=0
count_hsts_https=0
count_http_https=0
count_only_https=0
count_only_http=0
count_tls1_2_tls1_3=0
count_tls1_1=0
count_sslv3_tls1=0
count_sslv2=0
count_valid=0
count_u_revoke=0
count_e_h=0
count_e_m=0
count_e_l=0
count_ee=0
re='^[0-9]+$'

     if [ "${code}" == "100" ] || [ "${code}"=="101" ] || [ "${code}"=="102" ] || [ "${code}"=="103" ] || [ "${code}"=="200" ] || [ "${code}"=="201" ] || [ "${code}"=="202" ] || [ "${code}"=="203" ] || [ "${code}"=="204" ] || [ "${code}"=="205" ] || [ "${code}"=="206" ] || [ "${code}"=="207" ] || [ "${code}"=="208" ] || [ "${code}"=="218" ] || [ "${code}"=="226" ] || [ "${code}"=="301" ] || [ "${code}"=="301" ] || [ "${code}"=="302" ] || [ "${code}"=="303" ] || [ "${code}"=="304" ] || [ "${code}"=="305" ] || [ "${code}"=="306" ] || [ "${code}"=="307" ] || [ "${code}"=="308" ]  ;
     then
	     v_a_http="active"
     else
             v_a_http="inactive"
     fi;

     if [ "${scode}"=="100" ] || [ "${scode}"=="101" ] || [ "${scode}"=="102" ] || [ "${scode}"=="103" ] || [ "${scode}"=="200" ] || [ "${scode}"=="201" ] || [ "${scode}"=="202" ] || [ "${scode}"=="203" ] || [ "${scode}"=="204" ] || [ "${scode}"=="205" ] || [ "${scode}"=="206" ] || [ "${scode}"=="207" ] || [ "${scode}"=="208" ] || [ "${scode}"=="218" ] || [ "${scode}"=="226" ] || [ "${scode}"=="301" ] || [ "${scode}"=="301" ] || [ "${scode}"=="302" ] || [ "${scode}"=="303" ] || [ "${scode}"=="304" ] || [ "${scode}"=="305" ] || [ "${scode}"=="306" ] || [ "${scode}"=="307" ] || [ "${scode}"=="308" ];
     then
     	     v_a_https="active"
     else
             v_a_https="inactive"
     fi;

     v_http=$( cut -d ',' -f 2 temp-a)
     v_hsts=$( cut -d ',' -f 4 temp-a)
     v_https=$( cut -d ',' -f 5 temp-a)
     v_shsts=$( cut -d ',' -f 7 temp-a)
     v_valid=$( cut -d ',' -f 9 temp-a)
     v_u_revoke=$( cut -d ',' -f 8 temp-a)
     v_expired=$( cut -d ',' -f 10 temp-a)
     v_sslv2=$( cut -d ',' -f 12 temp-a)
     v_sslv3=$( cut -d ',' -f 13 temp-a)
     v_tls1=$( cut -d ',' -f 14 temp-a)
     v_tls1_1=$( cut -d ',' -f 15 temp-a)
     v_tls1_2=$( cut -d ',' -f 16 temp-a)
     v_tls1_3=$( cut -d ',' -f 17 temp-a)
     if [ "${v_a_http}" == "active" ];
     then
           ((++count_active_http))
     fi;
     if [ "${v_a_https}" == "active" ];
     then
           ((++count_active_https))
     fi;


     ####echo $v_http $v_hsts $v_https $v_shsts
     if [ "${v_https}" == "yes" ] && [ "${v_shsts}" != "no" ];
     then
          #count_hsts_https=$((count_hsts_https+1))
          ((++count_hsts_https))
     elif [ "${v_https}" == "yes" ] && [ "${v_http}" == "yes" ];
     then
          #count_http_https=$((count_http_https+1))
          ((++count_http_https))
     elif [ "${v_https}" == "yes" ] && [ "${v_http}" == "no" ];
     then
          #count_only_https=$((count_only_https+1))
          ((++count_only_https))
     elif [ "${v_https}" == "no" ] && [ "${v_http}" == "yes" ];
     then
          #count_only_http=$((count_only_http+1))
          ((++count_only_http))
     fi;

     if [ "${v_valid}" == "OK" ];
     then
          #count_hsts_https=$((count_hsts_https+1))
          ((++count_valid))
     fi;

     if [ "${v_u_revoke}" == "good" ];
     then
          #count_hsts_https=$((count_hsts_https+1))
          ((++count_u_revoke))
     fi;

     if ! [[ $v_expired =~ $re ]] ;
     then
          ((++count_ee))
     elif [ $v_expired -ge 30 ];
     then
          ((++count_e_h))
     elif [ $v_expired -ge 7 ];
     then
          ((++count_e_m))
     elif [ $v_expired -lt 7 ] && [ $v_expired -gt 0 ];
     then
          ((++count_e_l))
     fi;


     if [ "${v_tls1_2}" == "yes" ] || [ "${v_tls1_3}" == "yes" ];
     then
          #count_hsts_https=$((count_hsts_https+1))
          ((++count_tls1_2_tls1_3))
     elif [ "${v_tls1_1}" == "yes" ];
     then
          #count_http_https=$((count_http_https+1))
          ((++count_tls1_1))
     elif [ "${v_sslv3}" == "yes" ] || [ "${v_tls1}" == "yes" ];
     then
          #count_only_https=$((count_only_https+1))
          ((++count_sslv3_tls1))
     elif [ "${v_sslv2}" == "yes" ];
     then
          #count_only_http=$((count_only_http+1))
          ((++count_sslv2))
     fi;

     	score1=$((count_active_http*4+count_active_http*6))
	score3=$((count_u_revoke*10))
	score4=$((count_e_h*10+count_e_m*5+count_e_l*(5/2)))
	score5=$((count_valid*10))
	score6=$((count_tls1_2_tls1_3*40+count_tls1_1*30+count_sslv3_tls1*20+count_sslv2*10))
	score2=$((count_hsts_https*20+count_http_https*15+count_only_https*10+count_only_http*0))
	#echo "Part 1 Active-Inactive is" ${score1} "/10"
    	#echo "Part 2 Basic status is" ${score2} "/20"
    	#echo "Part 3 Revoke status is" ${score3} "/10"
     	#echo "Part 4 Expired is" ${score4} "/10"
      	#echo "Part 5 Valid-Invalid is" ${score5} "/10"
      	#echo "Part 6 Protocol type is" ${score6} "/40"
      	total_score=$((score1+score2+score3+score4+score5+score6))
      	#echo "Total score is" ${total_score} "/100"

        domain_grade=""
if [ $total_score -ge 70 ] ;
then
          domain_grade="A"
elif [ $total_score -ge 60 ];
then
          domain_grade="B+"
elif [ $total_score -ge 50 ];
then
          domain_grade="B"
elif [ $total_score -ge 40 ];
then
          domain_grade="C+"
elif [ $total_score -ge 30 ];
then
          domain_grade="C"
elif [ $total_score -ge 20 ];
then
          domain_grade="D"
else
          domain_grade="F"
fi;
       #echo "Your grade is" ${domain_grade}
       url=$( cut -d ',' -f 1 temp-a )
       echo `tr -d "\n\r" < a.temp`","$score1","$score2","$score3","$score4","$score5","$score6","$domain_grade","$total_score >> temp-test.txt
       echo `tr -d "\n\r" < a.temp`","$score1","$score2","$score3","$score4","$score5","$score6","$domain_grade","$total_score 
       rm temp-a 2>/dev/null
       rm a.temp 2>/dev/null
#DATE_WITH_TIME_f=`date "+%Y%m%d-%H%M%S"`
#--------------------------------------------------------------------------#
rm TXT c 2>/dev/null
