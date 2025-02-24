#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/infraStacks';

const app = new cdk.App();
const stage = app.node.tryGetContext('stage');
const substage = app.node.tryGetContext('substage');
const primaryRegion = app.node.tryGetContext('primaryRegion');
const secondaryRegion = app.node.tryGetContext('secondaryRegion');
const awsAccount = app.node.tryGetContext('awsAccount');

const environment = substage ? `${stage}-${substage}` : stage;

// TODO Need to rework creation of cloudfront, since its global only need one, but both S3 buckets should already be created

new InfraStack(app, `${environment}-${primaryRegion}-InfraStack`, {
  env: { account: awsAccount, region: primaryRegion },
  stackName: `reddish-site-${environment}-${primaryRegion}`, // Add this line

  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});

new InfraStack(app, `${environment}-${secondaryRegion}-InfraStack`, {
  env: { account: awsAccount, region: secondaryRegion },
  stackName: `reddish-site-${environment}-${secondaryRegion}`, // Add this line
});
