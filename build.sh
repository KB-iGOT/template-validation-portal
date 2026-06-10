!/bin/bash

echo "Docker build script"

# Build script
set -eo pipefail

build_tag=$1
name='cbp-ai-ui'
node=$2
org=$3
ls -al
docker build -f ./Dockerfile --label commitHash=$(git rev-parse --short HEAD) -t ${org}/${name}:${build_tag} .

echo {\"image_name\" : \"${name}\", \"image_tag\" : \"${build_tag}\", \"node_name\" : \"$node\"} > metadata.json
