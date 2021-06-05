import {serverless} from '@packages/base';
import {bootstrap, dynamoDB, http} from "@packages/base/configWare";
import * as ddb from '@packages/base/configWare/dynamoDB';

export = serverless
    .use(bootstrap('hello'))
    .use(dynamoDB({
        table: 'HelloTable',
        permissions: [ddb.PutItem],
        attributes: ['id'],
        indexes: {
            PRIMARY: ['id'],
        }
    }))
    .use(http.get('/', 'hello'))
    .config()
;
