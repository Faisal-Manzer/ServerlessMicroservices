import {
  Context,
  APIGatewayEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';

export const handler = async(
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {

  console.log({ event, context });
  return { statusCode: 200, body: 'welcome' };
};
