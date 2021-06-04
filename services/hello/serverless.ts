import config from "@packages/base/config";

export = config('hello', () => ({
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
    }
}));
