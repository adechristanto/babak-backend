import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @IsOptional()
  PORT: number = 3001;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  REFRESH_JWT_SECRET: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN: string = '15m';

  @IsString()
  @IsOptional()
  REFRESH_JWT_EXPIRES_IN: string = '7d';

  @IsString()
  @IsOptional()
  CORS_ORIGINS: string = 'http://localhost:3000';

  @IsNumber()
  @IsOptional()
  RATE_LIMIT_AUTH: number = 10;

  @IsNumber()
  @IsOptional()
  RATE_LIMIT_SEARCH: number = 100;

  @IsString()
  @IsOptional()
  S3_BUCKET: string;

  @IsString()
  @IsOptional()
  S3_REGION: string;

  @IsString()
  @IsOptional()
  S3_ACCESS_KEY: string;

  @IsString()
  @IsOptional()
  S3_SECRET_KEY: string;

  @IsString()
  @IsOptional()
  S3_ENDPOINT: string;

  @IsString()
  @IsOptional()
  EMAIL_SERVICE: string;

  @IsString()
  @IsOptional()
  EMAIL_API_KEY: string;

  @IsString()
  @IsOptional()
  EMAIL_FROM: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  
  return validatedConfig;
}
