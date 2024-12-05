import * as cdk from 'aws-cdk-lib';
import { Bucket, BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import { Source, BucketDeployment } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import {
  Distribution,
  ViewerProtocolPolicy,
  ResponseHeadersPolicy,
  OriginRequestPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { S3StaticWebsiteOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { RecordTarget, ARecord, HostedZone } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { join } from 'path';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const certificate = Certificate.fromCertificateArn(
      this,
      'certificate',
      'arn:aws:acm:us-east-1:xxxx:certificate/dff3bf1d-1684-40e2-a6ba-ab08cfcbc2d4',
    );

    const bucket = new Bucket(this, 'frontEndBucket', {
      publicReadAccess: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS, // This only blocks public ACLs
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: true,
    });

    const originRequestPolicy = OriginRequestPolicy.fromOriginRequestPolicyId(
      this,
      'originRequestPolicy',
      'b689b0a8-53d0-40ab-baf2-68738e2966ac',
    );
    const responseHeadersPolicy =
      ResponseHeadersPolicy.fromResponseHeadersPolicyId(
        this,
        'responseHeadersPolicy',
        'e61eb60c-9c35-4d20-a928-2b84e02af89c',
      );

    const distribution = new Distribution(this, 'distribution', {
      defaultBehavior: {
        origin: new S3StaticWebsiteOrigin(bucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        originRequestPolicy: originRequestPolicy,
        responseHeadersPolicy: responseHeadersPolicy,
      },
      certificate: certificate,
      defaultRootObject: 'index.html',
      domainNames: ['joshua.reddish.me'],
    });

    const s3SourcePath = join(__dirname, '../../personal-site/out');

    new BucketDeployment(this, 'reddishS3Deployment', {
      sources: [Source.asset(s3SourcePath)],
      destinationBucket: bucket,
      distribution: distribution,
      memoryLimit: 512,
    });

    const zone = HostedZone.fromLookup(this, 'zone', {
      domainName: 'reddish.me',
    });

    new ARecord(this, 'aliasRecord', {
      zone: zone,
      recordName: 'joshua.reddish.me',
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });

    new cdk.CfnOutput(this, 'CloudFrontDomainName', {
      value: distribution.domainName,
    });
  }
}
