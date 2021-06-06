import _ from 'lodash';
import {ConfigWare, DynamoDBAttributeType} from '../types';

export const GetItem = 'dynamodb:GetItem';
export const Scan = 'dynamodb:Scan';
export const PutItem = 'dynamodb:PutItem';
export const UpdateItem = 'dynamodb:UpdateItem';
export const Query = 'dynamodb:Query';

type KeySchema = [string, string?] | {
    keys: [string, string?];
    projection?: 'ALL' | 'KEYS_ONLY';
    include: string[];
    rcu?: Number;
    wcu?: Number;
    type: 'GSI';
}

interface Params {
    table: string;
    permissions: string[];
    attributes: string[] | {
        [attribute: string]: DynamoDBAttributeType
    };
    indexes: {
        [indexName: string]: KeySchema;
        PRIMARY: KeySchema;
    }
}

const transformIndex = (index: KeySchema, IndexName?: string) => {
    if (_.isArray(index)) return {
        IndexName,
        KeySchema: index.filter(_.isString).map((attribute, i) => ({
            AttributeName: attribute,
            KeyType: i === 0 ? 'HASH' : 'RANGE'
        })),
        BillingMode: 'PAY_PER_REQUEST',
        ...(IndexName && {
            Projection: {
                ProjectionType: 'KEY_ONLY'
            }
        })
    }

    return {
        IndexName,
        KeySchema: index.keys.filter(_.isString).map((attribute, i) => ({
            AttributeName: attribute,
            KeyType: i === 0 ? 'HASH' : 'RANGE'
        })),
        ...((index.rcu || index.wcu) && {
            ProvisionedThroughput: {
                ...(index.rcu && {ReadCapacityUnits: index.rcu.toString()}),
                ...(index.wcu && {WriteCapacityUnits: index.wcu.toString()})
            }
        }),
        ...(IndexName && {
            Projection: {
                ProjectionType: index.include ? 'INCLUDE' : (index.projection || 'KEYS_ONLY'),
                ...(index.include && {
                    NonKeyAttributes: index.include
                })
            },
        }),
        ...((!index.rcu && !index.wcu) && {
            BillingMode: 'PAY_PER_REQUEST'
        })
    }
};

const dynamoDB = ({table, permissions, attributes, indexes,}: Params): ConfigWare => ({stage}) => {
    let AttributeDefinitions;
    if (_.isArray(attributes)) AttributeDefinitions = attributes.map((attribute) => ({
        AttributeName: attribute,
        AttributeType: 'S'
    }));
    else AttributeDefinitions = Object.keys(attributes).map((attributeName) => ({
        AttributeName: attributeName,
        AttributeType: attributes[attributeName],
    }));

    const gsi = Object.keys(indexes).filter((name) => name !== 'PRIMARY')

    return {
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
                        AttributeDefinitions: AttributeDefinitions,
                        ...transformIndex(indexes['PRIMARY']),
                        ...(gsi.length && {
                            GlobalSecondaryIndexes: gsi.map((indexName) => transformIndex(indexes[indexName], indexName))
                        }),
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
    }
};

export default dynamoDB;
