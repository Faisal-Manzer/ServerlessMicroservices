import path from 'path';
import dotenv from 'dotenv';
const {parsed: env = {}} = dotenv.config({
    path: path.join(__dirname, '.env')
});

import commander from 'commander';
import merge from 'lodash/merge';

commander
    .option('--stage <n>', 'stage', 'dev')
    .option('--region <n>', 'region', env.DEFAULT_REGION)
    .option('--domain <n>', 'domain', env.DEFAULT_DOMAIN)
    .allowUnknownOption(true)
    .parse(process.argv);

const options = commander.opts();
const {stage, region, domain} = options;


interface ConfigParam {
    options: typeof options,
    env: typeof env
}
type Config = (params: ConfigParam) => any;

export default (serviceName: string, config: Config) => merge({}, {
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
            domainName: `${serviceName}.${stage === 'prod' ? '' : `${stage}.`}${domain}`,
            stage,
            createRoute53Record: true
        }
    }
}, config({options, env}));
