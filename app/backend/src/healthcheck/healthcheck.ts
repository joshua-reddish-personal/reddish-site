import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

const handler: APIGatewayProxyHandler = async (event, context): Promise<APIGatewayProxyResult> => {
  // Handle the API Gateway proxy event
  // Access event properties like event.path, event.queryStringParameters, etc.
  
  // Perform some logic
  
  // Return a response object
  return {
    statusCode: 200,
    body: 'Hello, world! You reached reddishReviews.com Healthcheck!'
  };
};

export { handler };
