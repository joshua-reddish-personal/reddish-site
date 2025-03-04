#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/infraStacks';
import { CDNStack } from '../lib/CDNStack';

const app = new cdk.App();
const stage = app.node.tryGetContext('stage');
const substage = app.node.tryGetContext('substage');
const primaryRegion = app.node.tryGetContext('primaryRegion');
const secondaryRegion = app.node.tryGetContext('secondaryRegion');
const awsAccount = app.node.tryGetContext('awsAccount');

const environment = substage ? `${stage}-${substage}` : stage;

const primaryStack = new InfraStack(
    app,
    `${environment}-${primaryRegion}-InfraStack`,
    {
        env: { account: awsAccount, region: primaryRegion },
        stackName: `reddish-site-${environment}-${primaryRegion}`,
        environment: environment,
    },
);

const secondaryStack = new InfraStack(
    app,
    `${environment}-${secondaryRegion}-InfraStack`,
    {
        env: { account: awsAccount, region: secondaryRegion },
        stackName: `reddish-site-${environment}-${secondaryRegion}`,
        environment: environment,
    },
);

new CDNStack(app, `${environment}-CDNStack`, {
    env: { account: awsAccount, region: primaryRegion },
    stackName: `reddish-site-${environment}-CDN`,
    environment: environment,
    primaryBucketArn: primaryStack.bucketArn,
    secondaryBucketArn: secondaryStack.bucketArn,
});
