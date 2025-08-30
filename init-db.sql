-- Babak Marketplace Database Initialization
-- This script sets up the database with necessary extensions and configurations

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create indexes for full-text search (will be applied after migrations)
-- These are commented out as they will be created via Prisma migrations
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_listings_search 
--   ON listings USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Set up database configuration for optimal performance
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET track_activity_query_size = 2048;
ALTER SYSTEM SET pg_stat_statements.track = 'all';

-- Reload configuration
SELECT pg_reload_conf();
