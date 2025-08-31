# Test Users Documentation

This document provides information about the test users created for the Babak Marketplace platform and how to use them for testing purposes.

## Test User Credentials

The following test users have been created with all necessary attributes and email verification completed:

### 1. Super User
- **Email:** `pratomoadhe+20@gmail.com`
- **Password:** `Superuser123`
- **Role:** `SUPERUSER`
- **Phone:** `+6281234567890`
- **Location:** `Jakarta, Indonesia`
- **Bio:** Super user account for testing purposes with full system access.
- **Avatar:** Random image from Picsum

### 2. Admin User
- **Email:** `pratomoadhe+21@gmail.com`
- **Password:** `Superuser123`
- **Role:** `ADMIN`
- **Phone:** `+6281234567891`
- **Location:** `Bandung, Indonesia`
- **Bio:** Admin user account for testing moderation and administrative features.
- **Avatar:** Random image from Picsum

### 3. Test User 1
- **Email:** `pratomoadhe+22@gmail.com`
- **Password:** `Superuser123`
- **Role:** `USER`
- **Phone:** `+6281234567892`
- **Location:** `Surabaya, Indonesia`
- **Bio:** Regular user account for testing marketplace features.
- **Avatar:** Random image from Picsum

### 4. Test User 2
- **Email:** `pratomoadhe+23@gmail.com`
- **Password:** `Superuser123`
- **Role:** `USER`
- **Phone:** `+6281234567893`
- **Location:** `Medan, Indonesia`
- **Bio:** Another regular user account for testing interactions.
- **Avatar:** Random image from Picsum

## User Attributes

All test users have been created with the following attributes:

### ✅ Email Verification
- All users have `emailVerified: true`
- No email verification tokens or expiration dates
- Ready to use immediately without email activation

### ✅ User Settings
- Email notifications enabled
- Push notifications enabled
- Message alerts enabled
- Listing updates enabled
- Marketing emails disabled
- Public profile visibility
- Contact info visible
- Last seen visible
- Direct messages allowed
- System theme preference
- English language preference

### ✅ Profile Information
- Complete name, phone, location, and bio
- Avatar URLs pointing to random images
- Proper role assignments

## Test Data

The following test data has been created for realistic testing:

### 📦 Sample Listings
- **6 listings** created (3 per regular user)
- Categories: Phones, Computers, Vehicles, Real Estate, Electronics, Furniture
- Each listing includes:
  - Title, description, price
  - Category assignment
  - Location data (latitude/longitude)
  - Condition and negotiable status
  - VIP and featured flags
  - Sample images (2 per listing)

### ⭐ Reviews and Ratings
- **6 reviews** created
- 4-5 star ratings
- Realistic comments
- Cross-user reviews (users review each other's listings)

### ❤️ Favorites
- **6 favorites** created
- Users favorite each other's listings
- Proper relationship tracking

### 👁️ View Tracking
- **~90 views** created
- Mix of authenticated and anonymous views
- Realistic IP addresses and user agents
- Proper analytics data

### 🔔 Notifications
- **6 notifications** created per user
- Different notification types:
  - Listing views
  - New messages
  - Favorites added
- Mix of read and unread notifications

## Available Scripts

### Create Test Users Only
```bash
npm run db:create-test-users-simple
```
Creates the 4 test users with all attributes and email verification.

### Create Test Data Only
```bash
npm run db:create-test-data
```
Creates sample listings, reviews, favorites, views, and notifications for existing test users.

### Create Everything (Users + Data)
```bash
npm run db:create-test-users-simple
npm run db:create-test-data
```
Run both scripts in sequence to create complete test environment.

### Other Available Scripts
- `npm run db:seed` - Creates comprehensive seed data with categories and sample products
- `npm run db:studio` - Opens Prisma Studio for database inspection
- `npm run db:migrate` - Runs database migrations

## Testing Scenarios

### Super User Testing
- Full system access
- User management
- System configuration
- Analytics and reporting

### Admin User Testing
- Content moderation
- User management
- Listing approval/rejection
- Report handling

### Regular User Testing
- Marketplace browsing
- Listing creation and management
- Messaging and communication
- Favorites and reviews
- Profile management

### Cross-User Interactions
- User-to-user messaging
- Cross-listing reviews
- Favorites and interactions
- Notification systems

## Database Schema

The test users are created with the following database structure:

```sql
-- Users table
users (
  id, email, password_hash, name, avatar_url, phone, location, bio,
  role, email_verified, email_verification_token, email_verification_expires,
  created_at, updated_at
)

-- User settings table
user_settings (
  id, user_id, email_notifications, push_notifications, message_alerts,
  listing_updates, marketing_emails, profile_visibility, show_contact_info,
  show_last_seen, allow_direct_messages, theme, language, created_at, updated_at
)
```

## Security Notes

- All passwords are hashed using Argon2
- Email verification is completed for immediate testing
- No sensitive data is stored in plain text
- Test data is safe for development environments

## Troubleshooting

### If users don't exist
```bash
npm run db:create-test-users-simple
```

### If test data is missing
```bash
npm run db:create-test-data
```

### If database connection fails
```bash
npm run db:push
npm run db:generate
```

### If categories are missing
```bash
npm run db:seed
```

## Notes

- All test users use the same password for convenience
- Email addresses use Gmail's plus addressing for easy filtering
- Phone numbers are Indonesian format for realistic testing
- Locations are major Indonesian cities
- All timestamps are set to current time when created
- Test data is designed to be realistic but not production-ready
