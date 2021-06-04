import {
    Context,
    APIGatewayEvent,
    APIGatewayProxyResult,
} from 'aws-lambda';
import AWS from 'aws-sdk';
import {v4 as uuid} from 'uuid';


const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (
    event: APIGatewayEvent,
    context: Context,
): Promise<APIGatewayProxyResult> => {

    const payload = {
        id: uuid(),
        requestId: event?.requestContext?.requestId,
        userAgent: event?.headers?.['User-Agent'],
    };

    if (process.env.HELLO_TABLE_NAME)
        await dynamodb.put({
            TableName: process.env.HELLO_TABLE_NAME as string,
            Item: payload,
        }).promise();

    return {statusCode: 200, body: 'welcome'};
};
