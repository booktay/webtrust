#!/bin/bash
#------------------------/FORMAT/------------------------------------------#

#url,http,code,hsts,https,scode,shsts,CertificateStatus,SignatureStatus,Expired(days),Fingerprint,SSLv2,SSLv3,TLS1,TLS1.1,TLS1.2,TLS1.3,NPN/SPDY,ALPN/HTTP2
#www.nu.ac.th,yes,301,no,yes,200,max-age=31536000,good,no,565,SHA1,no,no,no,yes,yes,no,yes,yes

#--------------------------------------------------------------------------#

#clean 
file_use=$1
DATE_WITH_TIME_s=`date "+%Y%m%d-%H%M%S"`
rm output.txt output-1.txt temp output-3.txt  output-4.txt temp_2 temp-a
#######################INPUT FILE#######################
cp $file_use fix-use-gor-test-pro.txt
active_https=""
inactive_https=""
active_http=""
inactive_http=""
#cat fix-use-gor-test.txt | cut -d ',' -f 3 | sort | uniq -c

#Active-Inactive
#---code---#
awk 'BEGIN{OFS=FS=","} $3=="100" || $3=="101" || $3=="102" || $3=="103" || $3=="200" || $3=="201" || $3=="202" || $3=="203" || $3=="204" || $3=="205" || $3=="206" || $3=="207" || $3=="208" || $3=="218" || $3=="226" || $3=="301" || $3=="301" || $3=="302" || $3=="303" || $3=="304" || $3=="305" || $3=="306" || $3=="307" || $3=="308" {$3="active"}{print}' fix-use-gor-test-pro.txt >> output.txt
awk 'BEGIN{OFS=FS=","} $3!="active" {$3="inactive"}{print}' output.txt >> output-1.txt
cat output-1.txt | cut -d ',' -f 3 | sort | uniq -c >> temp
#---scode---#
awk 'BEGIN{OFS=FS=","} $6=="100" || $6=="101" || $6=="102" || $6=="103" || $6=="200" || $6=="201" || $6=="202" || $6=="203" || $6=="204" || $6=="205" || $6=="206" || $6=="207" || $6=="208" || $6=="218" || $6=="226" || $6=="301" || $6=="301" || $6=="302" || $6=="303" || $6=="304" || $6=="305" || $6=="306" || $6=="307" || $6=="308" {$6="active"}{print}' fix-use-gor-test-pro.txt >> output-3.txt
awk 'BEGIN{OFS=FS=","} $6!="active" {$6="inactive"}{print}' output-3.txt >> output-4.txt
cat output-4.txt | cut -d ',' -f 6 | sort | uniq -c >> temp_2

#Score Basic statistic web (30%)
#Active-Inactive (10)

check_1n=$( cat temp | xargs | cut -d ' ' -f 1 )
check_1=$( cat temp | xargs | cut -d ' ' -f 2 )
check_2n=$( cat temp | xargs | cut -d ' ' -f 3 )
check_2=$( cat temp | xargs | cut -d ' ' -f 4 )
check_1n_2=$( cat temp_2 | xargs | cut -d ' ' -f 1 )
check_1_2=$( cat temp_2 | xargs | cut -d ' ' -f 2 )
check_2n_2=$( cat temp_2 | xargs | cut -d ' ' -f 3 )
check_2_2=$( cat temp_2 | xargs | cut -d ' ' -f 4 )

if [ "${check_1}"  == "active" ];
then
     active_http=$(echo ${check_1n});
     inactive_http=$(echo ${check_2n});
else
     active_http=$(echo ${check_2n});
     inactive_http=$(echo ${check_1n});
fi;

if [ "${check_1_2}"  == "active" ];
then
     active_https=$(echo ${check_1n_2});
     inactive_https=$(echo ${check_2n_2});
else
     active_https=$(echo ${check_2n_2});
     inactive_https=$(echo ${check_1n_2});
fi;

all_num=$(($active_http + $inactive_http))
score1_1=$((active_http*4/all_num))
score1_2=$((active_https*6/all_num))
score1=$((score1_1+score1_2))

echo "Part 1 Active-Inactive is" ${score1} "/10"

#Base on type (20%)
#HSTS+HTTPS (20)
#HTTP+HTTPS (15)
#Only HTTPS (10)
#Only HTTP (0)
#score =  (flag-type-per-web*score)/all_num
count_hsts_https=0
count_http_https=0
count_only_https=0
count_only_http=0
#No_HSTS_HTTPS=$( cat fix-use-gor-test-pro.txt | cut -d ',' -f 7 | sort | uniq -c | grep no | xargs | cut -d ' ' -f 1 )
#HSTS_HTTPS=$((all_num-No_HSTS_HTTPS))

while read -r p; do
     echo $p >> temp-a
     v_http=$( cut -d ',' -f 2 temp-a)
     v_hsts=$( cut -d ',' -f 4 temp-a)
     v_https=$( cut -d ',' -f 5 temp-a) 
     v_shsts=$( cut -d ',' -f 7 temp-a)
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
     ####echo $count_hsts_https $count_http_https $count_only_https $count_only_http 
     rm temp-a
done < fix-use-gor-test-pro.txt

####echo $count_hsts_https $count_http_https $count_only_https $count_only_http
score2=$((count_hsts_https*20+count_http_https*15+count_only_https*10+count_only_http*0))
score2=$((score2/all_num))

echo "Part 2 Basic status is" ${score2} "/20"

#cat fix-use-gor-test.txt | cut -d ',' -f 1 | sort | uniq -c  | grep yes | cut -d ' ' -f 2

#Score Domain (30%)
#- Revolk 0 | not 10 
#cat fix-use-gor-test.txt | cut -d ',' -f 8 | sort | uniq -c


#- Expired 
#<7 | 2.5
#>=7, <30 | 5
#>=30 | 10
#cat fix-use-gor-test.txt | cut -d ',' -f 10 | sort | uniq -c


#- valid 10 | invalid 0
### ocsp test with PKI certificate
### next change be from openssl (openssl s_client -connect example.com:443 -servername example.com) use [Verify return code: 0 (ok)]
#cat fix-use-gor-test.txt | cut -d ',' -f 9 | sort | uniq -c

count_valid=0
count_u_revolk=0
count_e_h=0
count_e_m=0
count_e_l=0
count_ee=0
re='^[0-9]+$'

while read -r p; do
     echo $p >> temp-a

     v_valid=$( cut -d ',' -f 9 temp-a)
     v_u_revolk=$( cut -d ',' -f 8 temp-a)
     v_expired=$( cut -d ',' -f 10 temp-a)

     ####echo $v_sslv2 $v_sslv3 $v_tls1 $v_tls1_1 $v_tls1_2 $v_tls1_3
     if [ "${v_valid}" == "OK" ];
     then
          #count_hsts_https=$((count_hsts_https+1))
          ((++count_valid))
     fi;

     if [ "${v_u_revolk}" == "good" ];
     then
          #count_hsts_https=$((count_hsts_https+1))
          ((++count_u_revolk))
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

     ####echo $count_tls1_2_tls1_3 $count_tls1_1 $count_sslv3_tls1 $count_sslv2
     rm temp-a
done < fix-use-gor-test-pro.txt

score3=$((count_u_revolk*10))
score3=$((score3/all_num))
score4=$((count_e_h*10+count_e_m*5+count_e_l*(5/2)))
score4=$((score4/all_num))
score5=$((count_valid*10))
score5=$((score5/all_num))

echo "Part 3 Revolk status is" ${score3} "/10"
echo "Part 4 Expired is" ${score4} "/10"
echo "Part 5 Valid-Invalid is" ${score5} "/10"

#Score Protocol (40%)
#40% tls1.2,1.3
#30% tls 1.1
#20% tls 0 ssl 3
#10% ssl 2
#0% else
count_tls1_2_tls1_3=0
count_tls1_1=0
count_sslv3_tls1=0
count_sslv2=0

while read -r p; do
     echo $p >> temp-a

     v_sslv2=$( cut -d ',' -f 12 temp-a)
     v_sslv3=$( cut -d ',' -f 13 temp-a)
     v_tls1=$( cut -d ',' -f 14 temp-a)
     v_tls1_1=$( cut -d ',' -f 15 temp-a)
     v_tls1_2=$( cut -d ',' -f 16 temp-a)
     v_tls1_3=$( cut -d ',' -f 17 temp-a)
     
     ####echo $v_sslv2 $v_sslv3 $v_tls1 $v_tls1_1 $v_tls1_2 $v_tls1_3
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
     ####echo $count_tls1_2_tls1_3 $count_tls1_1 $count_sslv3_tls1 $count_sslv2
     rm temp-a
done < fix-use-gor-test-pro.txt

score6=$((count_tls1_2_tls1_3*40+count_tls1_1*30+count_sslv3_tls1*20+count_sslv2*10))
score6=$((score6/all_num))

echo "Part 6 Protocol tyep is" ${score6} "/40"

#Result Score (100%)

total_score=$((score1+score2+score3+score4+score5+score6))
echo "Total score is" ${total_score} "/100"

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
elif [ $total_score -lt 40 ];
then
          domain_grade="C+"
elif [ $total_score -lt 30 ];
then
          domain_grade="C"
elif [ $total_score -lt 20 ];
then
          domain_grade="D"
else
          domain_grade="F"
fi;

echo "url,http,code,hsts,https,scode,shsts,CertificateStatus,SignatureStatus,Expired(days),Fingerprint,SSLv2,SSLv3,TLS1,TLS1.1,TLS1.2,TLS1.3,NPN/SPDY,ALPN/HTTP2" >> v2_test.txt
domain=$( cat fix-use-gor-test-pro.txt | cut -d ',' -f 1 | rev | cut -d'.' -f 1-2 | rev | sort | uniq -c | xargs | cut -d' ' -f 2 )
echo "Your domain is" ${domain} "Grade is" ${domain_grade}

#Timestamp
DATE_WITH_TIME_f=`date "+%Y%m%d-%H%M%S"`
echo "Start :" ${DATE_WITH_TIME_s} "Calculated :" ${DATE_WITH_TIME_f}
#Add to base file
sed -i '1d' fix-use-gor-test-pro.txt
temp=$( echo ","$active_http","$active_https","$inactive_http","$inactive_https","$domain_grade","${DATE_WITH_TIME_f} )
sed -i "1 s|$|$temp|" fix-use-gor-test-pro.txt
ex -sc '1i|url,http,code,hsts,https,scode,shsts,CertificateStatus,SignatureStatus,Expired(days),Fingerprint,SSLv2,SSLv3,TLS1,TLS1.1,TLS1.2,TLS1.3,NPN/SPDY,ALPN/HTTP2,Active-http,Active-https,Inactive-http,Inactive-https,ScoreDomain,Timestamp' -cx fix-use-gor-test-pro.txt
#######################OUTPUT FILE#######################
cp fix-use-gor-test-pro.txt ${DATE_WITH_TIME_f}"-"${domain}.txt
mv ${DATE_WITH_TIME_f}"-"${domain}.txt ./scored_file 
rm fix-use-gor-test-pro.txt
