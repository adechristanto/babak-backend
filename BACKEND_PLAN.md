# Babak Marketplace Backend Implementation Plan

## Overview

This document outlines the comprehensive backend implementation plan for the Babak Marketplace platform. The backend will serve as the API layer for the React frontend, providing authentication, listings management, messaging, and all core marketplace functionality.

## Technology Stack

### Core Technologies
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: NestJS (modular, scalable architecture)
- **Database**: PostgreSQL 14+ with Prisma ORM
- **Authentication**: JWT (access + refresh tokens)
- **File Storage**: S3-compatible (AWS S3 or MinIO for dev)
- **Validation**: class-validator + class-transformer
- **Testing**: Jest + Supertest for integration tests

### Development Tools
- **API Documentation**: Swagger/OpenAPI integration
- **Code Quality**: ESLint + Prettier + Husky
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Structured logging with Pino

## Database Design

### Core Tables and Relationships

#### Users and Authentication
```sql
-- Users table
users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  role user_role DEFAULT 'user', -- ENUM: 'user', 'admin'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User sessions for refresh token management
user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  refresh_token_hash VARCHAR(255) NOT NULL,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
);
```

#### Categories and Listings
```sql
-- Hierarchical categories
categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  parent_id INTEGER REFERENCES categories(id),
  depth INTEGER DEFAULT 0,
  path TEXT, -- Materialized path for efficient queries
  created_at TIMESTAMP DEFAULT NOW()
);

-- Main listings table
listings (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
  currency VARCHAR(3) DEFAULT 'USD',
  category_id INTEGER REFERENCES categories(id),
  city VARCHAR(255),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  status listing_status DEFAULT 'draft', -- ENUM: 'draft', 'active', 'pending', 'rejected', 'archived'
  is_vip BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Listing images
listing_images (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Messaging System
```sql
-- Message threads
threads (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  last_message_at TIMESTAMP DEFAULT NOW()
);

-- Thread participants
thread_participants (
  id SERIAL PRIMARY KEY,
  thread_id INTEGER REFERENCES threads(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(thread_id, user_id)
);

-- Messages
messages (
  id SERIAL PRIMARY KEY,
  thread_id INTEGER REFERENCES threads(id) ON DELETE CASCADE,
  sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Additional Features
```sql
-- User favorites
favorites (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, listing_id)
);

-- Reviews and ratings
reviews (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
  reviewer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User notifications
notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Content reports
reports (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
  reporter_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  reason VARCHAR(255) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Database Indexes

#### Performance Indexes
```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Session indexes
CREATE INDEX idx_user_sessions_user_id_expires ON user_sessions(user_id, expires_at);

-- Category indexes
CREATE UNIQUE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_path ON categories USING GIN(path gin_trgm_ops);

-- Listing indexes
CREATE INDEX idx_listings_seller_id ON listings(seller_id);
CREATE INDEX idx_listings_category_id ON listings(category_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_created_at_desc ON listings(created_at DESC);
CREATE INDEX idx_listings_vip_featured ON listings(is_vip, is_featured);
CREATE INDEX idx_listings_location ON listings(latitude, longitude);
CREATE INDEX idx_listings_search ON listings USING GIN(to_tsvector('english', title || ' ' || description));

-- Image indexes
CREATE INDEX idx_listing_images_listing_position ON listing_images(listing_id, position);

-- Messaging indexes
CREATE INDEX idx_threads_listing_id ON threads(listing_id);
CREATE INDEX idx_threads_last_message_desc ON threads(last_message_at DESC);
CREATE INDEX idx_thread_participants_user_id ON thread_participants(user_id);
CREATE INDEX idx_messages_thread_created ON messages(thread_id, created_at);

-- Feature indexes
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_listing_id ON favorites(listing_id);
CREATE INDEX idx_reviews_listing_id ON reviews(listing_id);
CREATE INDEX idx_notifications_user_read_created ON notifications(user_id, read, created_at DESC);
CREATE INDEX idx_reports_listing_created ON reports(listing_id, created_at DESC);
```

## API Implementation Strategy

### Project Structure (NestJS)
```
src/
├── main.ts                 # Application entry point
├── app.module.ts          # Root module
├── common/                # Shared utilities
│   ├── guards/           # Auth guards, role guards
│   ├── interceptors/     # Response formatting, logging
│   ├── filters/          # Exception filters
│   ├── decorators/       # Custom decorators
│   └── utils/            # Helper functions
├── config/               # Configuration management
│   ├── database.config.ts
│   ├── auth.config.ts
│   └── storage.config.ts
├── modules/
│   ├── auth/             # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/   # JWT, local strategies
│   │   └── dto/          # Auth DTOs
│   ├── users/            # User management
│   ├── categories/       # Category management
│   ├── listings/         # Listings CRUD
│   │   ├── listings.controller.ts
│   │   ├── listings.service.ts
│   │   ├── images/       # Image upload handling
│   │   └── dto/          # Listing DTOs
│   ├── messaging/        # Threads and messages
│   ├── favorites/        # User favorites
│   ├── reviews/          # Reviews and ratings
│   ├── notifications/    # User notifications
│   └── reports/          # Content reporting
├── prisma/               # Database layer
│   ├── prisma.service.ts
│   └── migrations/
└── types/                # Shared TypeScript types
```

### Authentication & Authorization

#### JWT Strategy
- **Access Token**: Short-lived (15 minutes), stored in memory
- **Refresh Token**: Long-lived (7 days), HTTP-only cookie
- **Password Hashing**: Argon2 for security
- **Session Management**: Track refresh tokens in database

#### Role-Based Access Control
```typescript
// Guards implementation
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  // Admin-only endpoints
}
```

### Input Validation & Sanitization

#### Validation Strategy
```typescript
// DTO with validation
export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  title: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  @Sanitize() // Custom decorator for HTML stripping
  description?: string;
}
```

### Error Handling

#### Global Exception Filter
```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Standardized error response format
    return {
      error: {
        code: 'ERROR_CODE',
        message: 'User-friendly message',
        details: validationErrors // Only in development
      }
    };
  }
}
```

### File Upload Strategy

#### Image Upload Flow
1. **Presigned URL**: Generate S3 presigned URL for direct upload
2. **Metadata Storage**: Store image metadata in database
3. **Validation**: File type, size validation
4. **Processing**: Optional thumbnail generation via background jobs

```typescript
@Post('upload/sign')
async getPresignedUrl(@Body() dto: PresignedUrlDto) {
  return this.storageService.generatePresignedUrl(dto);
}
```

## Security Considerations

### API Security
- **CORS**: Configured for frontend domains only
- **Rate Limiting**: Auth endpoints (10/min), Search (100/min)
- **Helmet**: Security headers middleware
- **Input Sanitization**: XSS prevention
- **SQL Injection**: Prisma ORM protection

### Authentication Security
- **Password Policy**: Minimum 8 characters, complexity requirements
- **Session Security**: HTTP-only cookies, SameSite=Lax
- **Token Rotation**: Refresh token rotation on use
- **Brute Force Protection**: Account lockout after failed attempts

### Data Protection
- **Sensitive Data**: Hash passwords, tokens
- **PII Handling**: Minimal data collection, secure storage
- **Audit Logging**: Track sensitive operations

## Performance Optimization

### Database Performance
- **Connection Pooling**: Prisma connection pool configuration
- **Query Optimization**: Efficient joins, proper indexing
- **Pagination**: Cursor-based pagination for large datasets
- **Caching**: Redis for frequently accessed data (future)

### API Performance
- **Response Compression**: Gzip compression
- **Request Validation**: Early validation to reduce processing
- **Background Jobs**: Async processing for heavy operations
- **Monitoring**: Response time tracking

## Integration Points

### Frontend Integration
- **API Base URL**: Configurable via environment variables
- **Type Safety**: Shared TypeScript interfaces
- **Error Handling**: Consistent error format matching frontend expectations
- **Authentication**: Token-based auth flow

### External Services
- **Email Service**: SendGrid/AWS SES for notifications
- **Storage Service**: AWS S3 or MinIO for file storage
- **Maps Service**: Google Maps API for location features
- **Payment Service**: Stripe for premium features (future)

## Deployment Architecture

### Environment Configuration
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/babak

# Authentication
JWT_SECRET=your-jwt-secret
REFRESH_JWT_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
REFRESH_JWT_EXPIRES_IN=7d

# Storage
S3_BUCKET=babak-uploads
S3_REGION=us-east-1
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key

# Application
PORT=3001
NODE_ENV=production
CORS_ORIGINS=https://babak.com,https://www.babak.com

# Rate Limiting
RATE_LIMIT_AUTH=10
RATE_LIMIT_SEARCH=100
```

### Docker Configuration
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

### Health Checks
```typescript
@Get('health')
async healthCheck() {
  return {
    status: 'ok',
    database: await this.prisma.$queryRaw`SELECT 1`,
    storage: await this.storageService.healthCheck(),
    timestamp: new Date().toISOString()
  };
}
```

This plan provides a solid foundation for implementing a scalable, secure, and maintainable backend for the Babak Marketplace platform.
