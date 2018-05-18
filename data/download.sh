#! /bin/bash

# script requires jq: https://stedolan.github.io/jq/

start=$(date +%s)
i=1
while read id object; do
  echo "Downloading: $i (id $id)"
  curl $object -o $id.jpg
  let i++
  echo ""
done < <(cat images.ndjson| jq -r '.|"\(.id) \(.object)"')
end=$(date +%s)
echo  "$(($end - $start)) s"
