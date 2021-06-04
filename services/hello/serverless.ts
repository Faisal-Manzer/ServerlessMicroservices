import {config} from '@packages/base';
import {bootstrap, dynamoDB} from "@packages/base/configWare";
import * as ddb from '@packages/base/configWare/dynamoDB';

export = config
    .use(bootstrap('hello'))
    .use(dynamoDB({
        table: 'HelloTable',
        permissions: [ddb.PutItem],
    }))
    .merge({
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
    })
    .finish();
