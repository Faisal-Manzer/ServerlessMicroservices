export interface ServerlessConfig {
    [key as string]: any;
}

export interface Environment {
    DEFAULT_REGION: string | undefined,
    DEFAULT_DOMAIN: string | undefined
}

export interface CLIOptions {
    stage: string,
    region: string,
    domain: string
}

export type ConfigWare = (
    options: CLIOptions,
    env: Environment,
) => ServerlessConfig;

export type DynamoDBAttributeType = 'S' | 'N' | 'BOOL' | 'B' | 'SS';
