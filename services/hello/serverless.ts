import base from '@packages/base';

export = base.config('hello', ({options: {stage}}) => ({
    provider: {
        environment: {
            HELLO_TABLE_NAME: '${self:custom.HelloTable.name}',
        },
        iam: {
          role: {
              statements: [
                  {
                      Effect: 'Allow',
                      Action: [
                          'dynamodb:PutItem'
                      ],
                      Resource: [
                          '${self:custom.HelloTable.arn}',
                      ]
                  }
              ]
          }
        },
    },
    resources: {
        Resources: {
            HelloTable: {
                Type: 'AWS::DynamoDB::Table',
                Properties: {
                    TableName: `HelloTable-${stage}`,
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
    functions: {
        hello: {
            handler: 'handlers/hello.handler',
            events: [
                {
                    http: {
                        method: 'GET',
                        path: '/'
                    }
                }
            ]
        }
    },
    custom: {
        HelloTable: {
            name: {
                'Ref': 'HelloTable'
            },
            arn: {
                'Fn::GetAtt': ['HelloTable', 'Arn']
            }
        }
    }
}));
