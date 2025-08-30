declare enum Environment {
    Development = "development",
    Production = "production",
    Test = "test"
}
declare class EnvironmentVariables {
    NODE_ENV: Environment;
    PORT: number;
    DATABASE_URL: string;
    JWT_SECRET: string;
    REFRESH_JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    REFRESH_JWT_EXPIRES_IN: string;
    CORS_ORIGINS: string;
    RATE_LIMIT_AUTH: number;
    RATE_LIMIT_SEARCH: number;
    S3_BUCKET: string;
    S3_REGION: string;
    S3_ACCESS_KEY: string;
    S3_SECRET_KEY: string;
    S3_ENDPOINT: string;
    EMAIL_SERVICE: string;
    EMAIL_API_KEY: string;
    EMAIL_FROM: string;
}
export declare function validate(config: Record<string, unknown>): EnvironmentVariables;
export {};
