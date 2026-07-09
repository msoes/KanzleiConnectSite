#!/bin/bash
while true; do
  STATUS=$(aws acm describe-certificate --certificate-arn arn:aws:acm:us-east-1:103867726968:certificate/409a0793-8e31-4885-9f90-6d8ccb48bc3d --region us-east-1 --query "Certificate.Status" --output text)
  if [ "$STATUS" == "ISSUED" ]; then
    echo "Certificate is ISSUED! Creating CloudFront distribution..."
    aws cloudfront create-distribution --distribution-config file://cloudfront-config.json > cloudfront-output.json
    echo "CloudFront Distribution created!"
    grep -o '"DomainName": "[^"]*cloudfront.net"' cloudfront-output.json
    break
  fi
  echo "Still pending..."
  sleep 30
done
