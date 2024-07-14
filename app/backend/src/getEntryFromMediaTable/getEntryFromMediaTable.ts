import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { BatchGetCommand } from '@aws-sdk/lib-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

const ddbClient = new DynamoDBClient({});

const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  // Parse the JSON body from the event
  const requestBody = JSON.parse(event.body || '{}');
  const mediaTypes = requestBody.mediaTypes || [];
  
  try {
    const allItems = [];
    for (const mediaTypeObj of mediaTypes) {
      const mediaType = Object.keys(mediaTypeObj)[0];
      const ids = mediaTypeObj[mediaType];
      
      // Split ids into chunks of 100
      const chunks = chunkArray(ids, 100);
      
      for (const chunk of chunks) {
        const keys = chunk.map(id => ({ mediaType, mediaId: id })); // Assuming your primary key structure includes mediaType and mediaId
        const marshalledKeys = keys.map(key => marshall(key));
        const params = {
          RequestItems: {
            'YourTableName': {
              Keys: marshalledKeys
            }
          }
        };
        
        const command = new BatchGetCommand(params);
        const response = await ddbClient.send(command);
        // Assuming the response structure and handling it accordingly
        if (response.Responses?.YourTableName) {
          allItems.push(...response.Responses.YourTableName);
        }
      }
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify(allItems)
    };
  } catch (error) {
    console.error('DynamoDB error: ', error);
    return {
      statusCode: 500,
      body: 'Failed to retrieve items'
    };
  }
}

// Helper function to split array into chunks
function chunkArray(array: any[], chunkSize: number): any[][] {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

export { handler };