import * as cdk from 'aws-cdk-lib';
import { Bucket, BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface InfraStackProps extends cdk.StackProps {
    environment: string;
}

export class InfraStack extends cdk.Stack {
    public readonly bucketArn: string;
    constructor(scope: Construct, id: string, props: InfraStackProps) {
        super(scope, id, props);

        const bucket = new Bucket(this, 'frontEndBucket', {
            publicReadAccess: true,
            blockPublicAccess: BlockPublicAccess.BLOCK_ACLS, // This only blocks public ACLs
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: '404.html',
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            versioned: true,
        });

        this.bucketArn = bucket.bucketArn;
    }
}
