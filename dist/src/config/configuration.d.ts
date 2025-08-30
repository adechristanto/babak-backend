declare const _default: () => {
    port: number;
    nodeEnv: string;
    corsOrigins: string[];
    database: {
        url: string | undefined;
    };
    jwt: {
        secret: string | undefined;
        refreshSecret: string | undefined;
        expiresIn: string;
        refreshExpiresIn: string;
    };
    rateLimit: {
        auth: number;
        search: number;
    };
    storage: {
        bucket: string | undefined;
        region: string | undefined;
        accessKey: string | undefined;
        secretKey: string | undefined;
        endpoint: string | undefined;
    };
    email: {
        service: string | undefined;
        apiKey: string | undefined;
        from: string | undefined;
    };
};
export default _default;
