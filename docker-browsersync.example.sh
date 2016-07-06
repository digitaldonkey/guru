#!/usr/bin/env bash
set -o errexit
docker run -it --rm \
           --name browser-sync \
           --link gep:gep.dd \
           -p 3000:3000 \
           -p 3001:3001 \
           -p 8080:8080 \
-v $(pwd):/source \
  ustwo/browser-sync \
  start --proxy "gep.dd" --host "gep.dd" --files "css/*.css, js/*.min.js, styleguide/*.html, styleguide/*.js, styleguide/*.css"
