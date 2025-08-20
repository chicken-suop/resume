#!/bin/bash
set -ex

touch ./public/resume.pdf
docker compose -f docker-compose-build.yml up --build --exit-code-from pdf-builder --abort-on-container-exit
bun vite build
touch dist/.nojekyll
cp public/resume.base.json dist/
cp public/CNAME dist/
cp public/.htaccess dist/