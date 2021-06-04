import {ConfigWare} from "../types";
import _ from 'lodash';

export const GetItem = 'dynamodb:GetItem';
export const Scan = 'dynamodb:Scan';
export const PutItem = 'dynamodb:PutItem';
export const UpdateItem = 'dynamodb:UpdateItem';
export const Query = 'dynamodb:Query';

interface Params {
    table: string;
    permissions: string[];
}

const dynamoDB =
    ({table, permissions}: Params): ConfigWare =>
        ({stage}) => ({
            provider: {
                environment: {
                    [`${_.snakeCase(table).toUpperCase()}`]: `\${self:custom.${table}.name}`,
                },
                iam: {
                    role: {
                        statements: [
                            {
                                Effect: 'Allow',
                                Action: permissions,
                                Resource: [
                                    `\${self:custom.${table}.arn}`,
                                ]
                            }
                        ]
                    }
                },
            },
            resources: {
                Resources: {
                    [table]: {
                        Type: 'AWS::DynamoDB::Table',
                        Properties: {
                            TableName: `${table}-${stage}`,
                            BillingMode: 'PAY_PER_REQUEST',
                            AttributeDefinitions: [
                                {
                                    AttributeName: 'id',
                                    AttributeType: 'S'
                                },
                            ],
                            KeySchema: [
                                {
                                    AttributeName: 'id',
                                    KeyType: 'HASH'
                                }
                            ]
                        }
                    }
                }
            },
            custom: {
                [table]: {
                    name: {
                        'Ref': table
                    },
                    arn: {
                        'Fn::GetAtt': [table, 'Arn']
                    }
                }
            }
        });

export default dynamoDB;
