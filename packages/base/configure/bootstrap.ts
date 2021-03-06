import {ConfigWare} from "../types";

const bootstrap =
    (serviceName: string): ConfigWare =>
        ({stage, region}, env) => ({
            service: serviceName,
            plugins: [
                'serverless-bundle',
                'serverless-pseudo-parameters',
                'serverless-domain-manager',
            ],
            provider: {
                name: 'aws',
                runtime: 'nodejs14.x',
                memorySize: 256,
                stage,
                region,
                lambdaHashingVersion: 20201221
            },
            custom: {
                bundle: {
                    disableForkTsChecker: true,
                },
                customDomain: {
                    basePath: '',
                    domainName: `${serviceName}.${stage === 'prod' ? '' : `${stage}.`}${env.DEFAULT_DOMAIN}`,
                    stage,
                    createRoute53Record: true
                }
            }
        });

export default bootstrap;
