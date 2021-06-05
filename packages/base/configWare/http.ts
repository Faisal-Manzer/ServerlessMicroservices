import {ConfigWare} from '../types';

const http = (method: string) => (path: string, name: string): ConfigWare => () => {
    return {
        functions: {
            [name]: {
                handler: `handlers/${name}.handler`,
                events: [
                    {
                        http: {method, path}
                    }
                ]
            }
        },
    };
}

export default {
    get: http('GET'),
    post: http('POST'),
    patch: http('PATCH'),
    put: http('PUT'),
    delete: http('DELETE'),
    generic: (method: string, path: string, name: string) => http(method)(path, name)
};
