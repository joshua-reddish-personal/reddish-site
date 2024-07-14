import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3Deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cforigins from 'aws-cdk-lib/aws-cloudfront-origins';
// import * as apigw from 'aws-cdk-lib/aws-apigateway';
// import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
// import { join } from 'path';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { apigwLambdas } from './apigwLambdas';
import { join } from 'path';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const certificate = acm.Certificate.fromCertificateArn(
      this,
      'certificate',
      'arn:aws:acm:us-east-1:xxxx:certificate/ce8c2ed0-6b38-46c1-9099-a140322d6e83',
    );

    const bucket = new s3.Bucket(this, 'frontEndBucket', {
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS, // This only blocks public ACLs
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: true,
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(30),
          transitions: [
            {
              storageClass: s3.StorageClass.INTELLIGENT_TIERING,
              transitionAfter: cdk.Duration.days(7),
            },
            {
              storageClass: s3.StorageClass.GLACIER,
              transitionAfter: cdk.Duration.days(14),
            },
          ],
        },
      ],
    });

    const api = new apigwLambdas(this, 'backendAPIGW');

    const apiKey = api.restAPI.addApiKey('reddishReviewsAPIKey', {
      apiKeyName: 'reddishReviewsBackendAPIKey',
    });

    // Create a usage plan
    const usagePlan = api.restAPI.addUsagePlan('usagePlan', {
      name: 'reddishReviewsUsagePlan',
      throttle: {
        burstLimit: 20,
        rateLimit: 100,
      },
      apiStages: [
        {
          api: api.restAPI,
          stage: api.restAPI.deploymentStage,
        },
      ],
    });

    usagePlan.addApiKey(apiKey);

    const originRequestPolicy =
      cloudfront.OriginRequestPolicy.fromOriginRequestPolicyId(
        this,
        'originRequestPolicy',
        'b689b0a8-53d0-40ab-baf2-68738e2966ac',
      );
    const responseHeadersPolicy =
      cloudfront.ResponseHeadersPolicy.fromResponseHeadersPolicyId(
        this,
        'responseHeadersPolicy',
        'e61eb60c-9c35-4d20-a928-2b84e02af89c',
      );

    const distribution = new cloudfront.Distribution(this, 'distribution', {
      defaultBehavior: {
        origin: new cforigins.S3Origin(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        originRequestPolicy: originRequestPolicy,
        responseHeadersPolicy: responseHeadersPolicy,
      },
      additionalBehaviors: {
        '/api/*': {
          origin: new cforigins.RestApiOrigin(api.restAPI, {
            customHeaders: { 'x-api-key': apiKey.keyId },
          }),
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          originRequestPolicy: originRequestPolicy,
          responseHeadersPolicy: responseHeadersPolicy,
        },
      },
      certificate: certificate,
      defaultRootObject: 'index.html',
      domainNames: ['reddishreviews.com'],
    });

    const s3SourcePath = join(__dirname, '../../frontend');

    new s3Deploy.BucketDeployment(this, 'reddishReviewS3Deployment', {
      sources: [s3Deploy.Source.asset(s3SourcePath)],
      destinationBucket: bucket,
      distribution: distribution,
      memoryLimit: 512,
    });

    const zone = route53.HostedZone.fromLookup(this, 'zone', {
      domainName: 'reddishreviews.com',
    });

    new route53.ARecord(this, 'aliasRecord', {
      zone: zone,
      recordName: 'reddishreviews.com',
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution),
      ),
    });

    new cdk.CfnOutput(this, 'CloudFrontDomainName', {
      value: distribution.domainName,
    });
  }
}
