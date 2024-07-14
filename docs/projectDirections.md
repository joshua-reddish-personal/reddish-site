Creating a web application to display your media review site involves several steps, especially when you're integrating a variety of AWS services like DynamoDB, CloudFront, S3, API Gateway, and Lambda, along with using AWS CDK (Cloud Development Kit) for infrastructure as code. Here's a high-level approach:

### 1. Planning and Structuring Your Data

Before diving into AWS resources, ensure your media review data is well-structured for DynamoDB. This step involves defining the table's primary key (and sort key if necessary) that best suits your data access patterns.

### 2. Setting Up Your AWS Environment

If you haven't already, set up an AWS account, install the AWS CLI, and configure it with your credentials. Also, install the AWS CDK CLI.

### 3. Initializing Your CDK Project

In your terminal or command prompt:

```bash
cdk init app --language=python
```

This command creates a new CDK application in Python.

### 4. Adding Dependencies

Navigate to your project's root directory. You'll need to install several libraries for working with the required AWS services.

```bash
pip install aws-cdk.aws-dynamodb aws-cdk.aws-s3 aws-cdk.aws-lambda aws-cdk.aws-apigateway aws-cdk.aws-cloudfront aws-cdk.aws-s3-deployment
```

### 5. Define Your AWS Infrastructure

Now you begin coding your infrastructure. This involves creating a DynamoDB table, S3 bucket, Lambda function, API Gateway, and CloudFront distribution within your CDK app.

For instance, to create a DynamoDB table:

```python
from aws_cdk import core
from aws_cdk import aws_dynamodb as dynamodb

class MyMediaReviewsStack(core.Stack):
    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)
        
        # Creating a DynamoDB Table
        table = dynamodb.Table(self, "Reviews",
            partition_key=dynamodb.Attribute(name="id", type=dynamodb.AttributeType.STRING),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST
        )
```

Continue adding resources for S3, Lambda, API Gateway, and CloudFront within this stack.

### 6. Lambda Function for Handling Requests

Create a Lambda function in Python that interacts with DynamoDB to retrieve or update your media review data. This function will act as the backend for your API Gateway.

### 7. Setting Up API Gateway

Link your Lambda function to an API Gateway to create HTTP endpoints for your web application.

### 8. Hosting Your Website on S3 and CloudFront

Store your website's static files (HTML, CSS, JS) in an S3 bucket configured for web hosting. Use CloudFront to distribute these files globally. Ensure to configure CloudFront to work with both your S3 bucket for static files and API Gateway for dynamic content.

### 9. Deploy Your CDK App

After defining all resources in your CDK app, deploy them to AWS:

```bash
cdk deploy
```

### 10. Populate DynamoDB with Existing Data

Use a script or manual uploads to migrate your existing review data in JSON format into the DynamoDB table.

### 11. Develop Your Web Frontend

Develop your web application's frontend. Use JavaScript (or a framework like React or Vue.js) to fetch data from your API Gateway and display it to users.

### 12. Update Your DNS Records

If you have a custom domain, update your DNS records to point to your CloudFront distribution.

### Additional Notes

- Throughout this process, always be mindful of AWS costs.
- Use the AWS Management Console to troubleshoot and monitor your services.
- Refer to the AWS CDK and service-specific documentation for detailed guidance and examples.

This overview gives a comprehensive path to follow but remember, each step involves specific details and decisions based on your unique requirements and data.
