import path from 'path';
import dotenv from 'dotenv';
import commander from 'commander';
import _ from 'lodash';

import {ConfigWare, ServerlessConfig, Environment, CLIOptions} from "./types";

export class Serverless {
    private current = {};
    private readonly env: Environment;
    private readonly cliOptions: CLIOptions;

    constructor() {
        const {parsed: env, error} = dotenv.config({
            path: path.join(__dirname, '.env')
        });

        if (error || !env) throw Error('Environment not found');
        this.env = (env as any) as Environment;

        commander
            .option('--stage <n>', 'stage', 'dev')
            .option('--region <n>', 'region', env.DEFAULT_REGION)
            .allowUnknownOption(true)
            .parse(process.argv);

        const options = commander.opts();
        this.cliOptions = (options as any) as CLIOptions;
    }

    merge(config: ServerlessConfig) {
        this.current = _.merge({}, this.current, config);
        return this;
    }

    use(configWare: ConfigWare) {
        const newConfig = configWare(this.cliOptions, this.env);
        return this.merge(newConfig);
    }

    config() {
        return this.current;
    }
}

const serverless = new Serverless();
export default serverless;
