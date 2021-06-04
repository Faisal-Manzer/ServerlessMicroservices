import path from 'path';
import dotenv from 'dotenv';

const {parsed: env = {}} = dotenv.config({
    path: path.join(__dirname, '.env')
});

import commander from 'commander';
import _ from 'lodash';
import {ConfigWare, ServerlessConfig} from "./types";

commander
    .option('--stage <n>', 'stage', 'dev')
    .option('--region <n>', 'region', env.DEFAULT_REGION)
    .option('--domain <n>', 'domain', env.DEFAULT_DOMAIN)
    .allowUnknownOption(true)
    .parse(process.argv);

const options = commander.opts();
const {stage, region, domain} = options;

export class Config {
    private current = {}

    constructor() {
    }

    merge(config: ServerlessConfig) {
        this.current = _.merge({}, this.current, config);
        return this;
    }

    use(configWare: ConfigWare) {
        const newConfig = configWare({stage, region, domain}, env as any);
        return this.merge(newConfig);
    }

    finish() {
        return this.current;
    }
}

const config = new Config();
export default config;
