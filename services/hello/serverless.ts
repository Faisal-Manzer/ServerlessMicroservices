import {serverless} from '@packages/base';
import {bootstrap, dynamoDB, http} from "@packages/base/configure";
import * as DDB from '@packages/base/configure/dynamoDB';

export = serverless
    .use(bootstrap('hello'))
    .use(dynamoDB({
        table: 'HelloTable',
        permissions: [DDB.PutItem],
        attributes: ['id'],
        indexes: {
            PRIMARY: ['id'],
        }
    }))
    .use(http.get('/', 'hello'))
    .config()
;
