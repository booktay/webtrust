import csv, json, sys

file_input=sys.argv[1]
file_output=sys.argv[2]
with open(file_input, 'rb') as csvdata:
    next(csvdata, None) # skip the headers
    reader = csv.DictReader(csvdata,fieldnames=['website'])
    json.dump([row for row in reader], open(file_output, 'w+'))
