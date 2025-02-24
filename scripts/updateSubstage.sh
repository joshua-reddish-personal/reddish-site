#!/bin/bash

# Get the main Route 53 URL
main_url=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='joshua.reddish.me.'].Id" --output text)

# Get the CloudFront distribution ID
cloudfront_id=$(aws cloudfront list-distributions --query "DistributionList.Items[?Origins.Items[0].DomainName=='$main_url'].Id" --output text)

# Get the domain names attached to the CloudFront distribution
domain_names=$(aws cloudfront get-distribution --id $cloudfront_id --query "Distribution.DistributionConfig.Aliases.Items" --output text)

# Check if one of the domains has blue or green in it and set substage to the opposite
if echo "$domain_names" | grep -q "blue"; then
  SUBSTAGE="green"
elif echo "$domain_names" | grep -q "green"; then
  SUBSTAGE="blue"
else
  echo "No blue or green SUBSTAGE found in domain names."
  exit 1
fi

# Update the cdk.json file with the new SUBSTAGE
export SUBSTAGE=$SUBSTAGE
echo('Updated substage to $SUBSTAGE')