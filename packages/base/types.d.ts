export interface ServerlessConfig {
    [key as string]: any;
}

export type ConfigWare = (
    options: { stage: string, region: string, domain: string },
    env: { DEFAULT_REGION: string | undefined, DEFAULT_DOMAIN: string | undefined }
) => ServerlessConfig;
