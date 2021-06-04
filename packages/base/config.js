const path = require('path');
const dotenv = require('dotenv');

const {parsed: env = {}} = dotenv.config({
    path: path.join(__dirname, '.env')
});

const program = require('commander');
const merge = require('lodash/merge');

program
    .option('--stage <n>', 'stage', 'dev')
    .option('--region <n>', 'region', env.DEFAULT_REGION)
    .option('--domain <n>', 'domain', env.DEFAULT_DOMAIN)
    .allowUnknownOption(true)
    .parse(process.argv);

const options = program.opts();
const {stage, region, domain} = options;

module.exports = (serviceName, config) => merge({}, {
    service: serviceName,
    plugins: [
        'serverless-bundle',
        'serverless-pseudo-parameters',
        'serverless-plugin-monorepo',
        'serverless-domain-manager',
    ],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        memorySize: 256,
        stage,
        region
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
