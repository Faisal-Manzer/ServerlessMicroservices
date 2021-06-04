const {config} = require('@packages/base');

module.exports = config('hello', () => ({
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
