import * as fs from 'fs';
import { Construct } from 'constructs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
// import * as apigwAuth from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import * as cognito from 'aws-cdk-lib/aws-cognito';

// Assuming config.json is in the root of your CDK project
const configPath = join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

export class apigwLambdas extends Construct {
  public readonly restAPI: apigw.RestApi;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.restAPI = new apigw.RestApi(this, 'backendAPIGWLambdas', {
      restApiName: 'Movies API',
    });

    const userPool = cognito.UserPool.fromUserPoolArn(
      this,
      'user-pool',
      config.COGNITO_USER_POOL_ARN,
    );

    // const userPoolClient = cognito.UserPoolClient.fromUserPoolClientId(
    //   this,
    //   'user-pool-client',
    //   config.COGNITO_USER_POOL_CLIENT_ID,
    // );

    const cognitoAuthorizer = new apigw.CognitoUserPoolsAuthorizer(
      this,
      'cognitoAuthorizer',
      {
        cognitoUserPools: [userPool],
        identitySource: 'method.request.header.Authorization',
      },
    );

    const resource = this.restAPI.root.addResource('api');
    const lambdaPath = join(__dirname, '../../backend/src/');

    // Healthcheck endpoint
    const healthcheckLambda = new Function(this, 'healthcheckLambda', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'healthcheck/healthcheck.handler',
      code: Code.fromAsset(lambdaPath),
    });
    const healthcheckResource = resource.addResource('healthcheck');
    healthcheckResource.addMethod(
      'GET',
      new apigw.LambdaIntegration(healthcheckLambda),
      {
        apiKeyRequired: true,
        authorizer: cognitoAuthorizer,
      },
    );

    // Add Entry to DynamoDB endpoint
    const addEntryToMediaTableLambda = new Function(
      this,
      'addEntryToMediaTableLambda',
      {
        runtime: Runtime.NODEJS_20_X,
        handler: 'addEntryToMediaTable/addEntryToMediaTable.handler',
        code: Code.fromAsset(lambdaPath),
        environment: {
          TABLE_NAME: 'mediaTable',
        },
      },
    );
    const addEntryToMediaTableResource = resource.addResource(
      'addEntryToMediaTableResource',
    );
    addEntryToMediaTableResource.addMethod(
      'POST',
      new apigw.LambdaIntegration(addEntryToMediaTableLambda),
      {
        apiKeyRequired: true,
        authorizer: cognitoAuthorizer,
      },
    );

    // Get Entry from DynamoDB endpoint
    const getEntryFromMediaTableLambda = new Function(
      this,
      'getEntryFromMediaTableLambda',
      {
        runtime: Runtime.NODEJS_20_X,
        handler: 'getEntryFromMediaTable/getEntryFromMediaTable.handler',
        code: Code.fromAsset(lambdaPath),
        environment: {
          TABLE_NAME: 'mediaTable',
        },
      },
    );
    const getEntryFromMediaTableResource = resource.addResource(
      'getEntryFromMediaTableResource',
    );
    getEntryFromMediaTableResource.addMethod(
      'GET',
      new apigw.LambdaIntegration(getEntryFromMediaTableLambda),
      {
        apiKeyRequired: true,
        authorizer: cognitoAuthorizer,
      },
    );
  }
}
