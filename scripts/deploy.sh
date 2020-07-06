#!/bin/bash

set -eu

S3_BUCKET=blog.odan.dev
CLOUDFRONT_DISTRIBUTION_ID=ECT72K2AV2HMN

aws s3 cp --recursive ./dist s3://$S3_BUCKET
aws s3 cp --recursive ./dist s3://$S3_BUCKET --exclude "*" --include="*.html" --cache-control 'public, max-age=0, must-revalidate'
aws s3 cp --recursive ./dist s3://$S3_BUCKET --exclude "*" --include="*.js" --cache-control 'public, max-age=31536000'
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
