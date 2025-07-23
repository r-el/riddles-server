# Database Migration Guide

## Phase 5: Authentication Schema Update

This document describes how to update the database schema to support authentication features.

## Required Changes

### 1. Supabase (PostgreSQL) Updates

**Connect to Supabase database**
   - Go to Supabase project dashboard
   - Navigate to the SQL Editor
   - Run the following SQL commands:

```sql
-- Add authentication fields to players table
ALTER TABLE players 
ADD COLUMN password_hash TEXT,
ADD COLUMN role TEXT NOT NULL DEFAULT 'user';

-- Add constraint for valid roles
ALTER TABLE players 
ADD CONSTRAINT valid_roles CHECK (role IN ('guest', 'user', 'admin'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_players_username ON players(username);
CREATE INDEX IF NOT EXISTS idx_players_role ON players(role);
```

### 2. Environment Variables

Add these new variables to your `.env` file:

```env
# Authentication Configuration
JWT_SECRET=your-jwt-secret-key-here
JWT_EXPIRES_IN=24h
ADMIN_SECRET_CODE=your-admin-secret-code
```

## Manual Admin Creation

To create an admin user manually:

```sql
INSERT INTO players (username, password_hash, role) 
VALUES ('admin', '$2b$10$hashedpasswordhere', 'admin');
```

Note: Replace `$2b$10$hashedpasswordhere` with an actual bcrypt hash of your desired password.

## Testing

After making these changes, we can test the authentication system:

```bash
npm test
```

## In conclusion

1. Run the migration SQL in Supabase database
2. Update `.env` file with the new variables
3. Restart the server
4. Test the authentication endpoints

## Rollback (if needed)

If rollback is needed, use following commands:

```sql
-- Remove the new columns
ALTER TABLE players DROP COLUMN IF EXISTS password_hash;
ALTER TABLE players DROP COLUMN IF EXISTS role;

-- Remove the indexes
DROP INDEX IF EXISTS idx_players_username;
DROP INDEX IF EXISTS idx_players_role;
```
