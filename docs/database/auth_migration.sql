-- Database Schema Updates for Authentication
-- Phase 5: Add authentication fields to players table

-- Add password and role fields to existing players table
ALTER TABLE players 
ADD COLUMN password_hash TEXT,
ADD COLUMN role TEXT NOT NULL DEFAULT 'user';

-- Add constraint to ensure valid roles
ALTER TABLE players 
ADD CONSTRAINT valid_roles CHECK (role IN ('guest', 'user', 'admin'));

-- Create index on username for faster authentication lookups
CREATE INDEX IF NOT EXISTS idx_players_username ON players(username);

-- Create index on role for faster role-based queries
CREATE INDEX IF NOT EXISTS idx_players_role ON players(role);

-- Comments for documentation
COMMENT ON COLUMN players.password_hash IS 'Bcrypt hashed password for authentication';
COMMENT ON COLUMN players.role IS 'User role: guest, user, or admin';

-- Display updated table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'players' 
ORDER BY ordinal_position;
