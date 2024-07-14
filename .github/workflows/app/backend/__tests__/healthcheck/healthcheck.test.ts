import { handler } from '../../src/healthcheck/healthcheck';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

describe('Health Check', () => {
  it('should return 200 status code and correct body', async () => {
    const event = {} as APIGatewayProxyEvent;
    const context = {} as Context;
    const result = await handler(event, context, () => {});

    console.log(typeof(result));
    expect(result?.statusCode).toBe(200);
    expect(result?.body).toBe('Hello, world! You reached reddishReviews.com!');
  });
});