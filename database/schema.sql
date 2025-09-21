-- ResQ Connect Database Schema
-- This file contains the complete database schema for the disaster management system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    avatar_url TEXT,
    full_name TEXT,
    bio TEXT,
    location TEXT,
    emergency_contacts TEXT[] DEFAULT '{}',
    preferences JSONB DEFAULT '{
        "notifications": true,
        "location_sharing": true,
        "disaster_alerts": true,
        "blockchain_verification": false
    }'::jsonb
);

-- Create disaster_reports table
CREATE TABLE disaster_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    disaster_type TEXT NOT NULL CHECK (disaster_type IN (
        'flood', 'earthquake', 'landslide', 'storm', 'fire', 'accident', 'other'
    )),
    description TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    photo_url TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN (
        'open', 'verified', 'resolved', 'false_alarm'
    )),
    severity TEXT DEFAULT 'medium' CHECK (severity IN (
        'low', 'medium', 'high', 'critical'
    )),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES auth.users(id),
    blockchain_hash TEXT,
    blockchain_verified BOOLEAN DEFAULT FALSE
);

-- Create danger_zones table
CREATE TABLE danger_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    polygon GEOGRAPHY(POLYGON, 4326) NOT NULL,
    zone_type TEXT NOT NULL CHECK (zone_type IN (
        'disaster', 'crime', 'construction', 'weather', 'other'
    )),
    severity TEXT DEFAULT 'medium' CHECK (severity IN (
        'low', 'medium', 'high', 'critical'
    )),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id),
    blockchain_hash TEXT,
    blockchain_verified BOOLEAN DEFAULT FALSE
);

-- Create emergency_alerts table
CREATE TABLE emergency_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL CHECK (alert_type IN (
        'medical', 'safety', 'weather', 'transport', 'other'
    )),
    message TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    severity TEXT DEFAULT 'medium' CHECK (severity IN (
        'low', 'medium', 'high', 'critical'
    )),
    status TEXT DEFAULT 'active' CHECK (status IN (
        'active', 'acknowledged', 'resolved', 'cancelled'
    )),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    blockchain_hash TEXT,
    blockchain_verified BOOLEAN DEFAULT FALSE
);

-- Create blockchain_verifications table
CREATE TABLE blockchain_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id UUID NOT NULL,
    record_type TEXT NOT NULL CHECK (record_type IN (
        'disaster_report', 'emergency_alert', 'danger_zone'
    )),
    hash TEXT NOT NULL,
    transaction_id TEXT NOT NULL,
    block_number BIGINT,
    network TEXT NOT NULL,
    verified_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);

CREATE INDEX idx_disaster_reports_reporter_id ON disaster_reports(reporter_id);
CREATE INDEX idx_disaster_reports_created_at ON disaster_reports(created_at);
CREATE INDEX idx_disaster_reports_location ON disaster_reports USING GIST (
    ST_Point(longitude, latitude)
);
CREATE INDEX idx_disaster_reports_type ON disaster_reports(disaster_type);
CREATE INDEX idx_disaster_reports_status ON disaster_reports(status);
CREATE INDEX idx_disaster_reports_severity ON disaster_reports(severity);

CREATE INDEX idx_danger_zones_polygon ON danger_zones USING GIST (polygon);
CREATE INDEX idx_danger_zones_type ON danger_zones(zone_type);
CREATE INDEX idx_danger_zones_active ON danger_zones(is_active);

CREATE INDEX idx_emergency_alerts_user_id ON emergency_alerts(user_id);
CREATE INDEX idx_emergency_alerts_created_at ON emergency_alerts(created_at);
CREATE INDEX idx_emergency_alerts_location ON emergency_alerts USING GIST (
    ST_Point(longitude, latitude)
);
CREATE INDEX idx_emergency_alerts_status ON emergency_alerts(status);

CREATE INDEX idx_blockchain_verifications_record ON blockchain_verifications(record_id, record_type);
CREATE INDEX idx_blockchain_verifications_hash ON blockchain_verifications(hash);

-- Create functions for location-based queries
CREATE OR REPLACE FUNCTION get_disasters_by_location(
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    radius_km DOUBLE PRECISION DEFAULT 10,
    limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
    id UUID,
    disaster_type TEXT,
    description TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    photo_url TEXT,
    status TEXT,
    severity TEXT,
    created_at TIMESTAMPTZ,
    distance_km DOUBLE PRECISION,
    profile_username TEXT,
    profile_avatar_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dr.id,
        dr.disaster_type,
        dr.description,
        dr.latitude,
        dr.longitude,
        dr.photo_url,
        dr.status,
        dr.severity,
        dr.created_at,
        ST_Distance(
            ST_Point(lng, lat)::geography,
            ST_Point(dr.longitude, dr.latitude)::geography
        ) / 1000 as distance_km,
        p.username as profile_username,
        p.avatar_url as profile_avatar_url
    FROM disaster_reports dr
    LEFT JOIN profiles p ON dr.reporter_id = p.id
    WHERE ST_DWithin(
        ST_Point(lng, lat)::geography,
        ST_Point(dr.longitude, dr.latitude)::geography,
        radius_km * 1000
    )
    ORDER BY distance_km ASC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to check if location is in danger zones
CREATE OR REPLACE FUNCTION check_location_in_danger_zones(
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    zone_type TEXT,
    severity TEXT,
    description TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dz.id,
        dz.name,
        dz.zone_type,
        dz.severity,
        dz.description
    FROM danger_zones dz
    WHERE dz.is_active = TRUE
    AND ST_Contains(dz.polygon, ST_Point(lng, lat)::geography);
END;
$$ LANGUAGE plpgsql;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disaster_reports_updated_at
    BEFORE UPDATE ON disaster_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_danger_zones_updated_at
    BEFORE UPDATE ON danger_zones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergency_alerts_updated_at
    BEFORE UPDATE ON emergency_alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE disaster_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE danger_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blockchain_verifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Disaster reports: Public read, authenticated write
CREATE POLICY "Anyone can view disaster reports" ON disaster_reports
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert disaster reports" ON disaster_reports
    FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can update own disaster reports" ON disaster_reports
    FOR UPDATE USING (auth.uid() = reporter_id);

-- Danger zones: Public read, admin write (for now, allow all authenticated users)
CREATE POLICY "Anyone can view danger zones" ON danger_zones
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert danger zones" ON danger_zones
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update danger zones" ON danger_zones
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Emergency alerts: Users can only access their own alerts
CREATE POLICY "Users can view own emergency alerts" ON emergency_alerts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emergency alerts" ON emergency_alerts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emergency alerts" ON emergency_alerts
    FOR UPDATE USING (auth.uid() = user_id);

-- Blockchain verifications: Public read, authenticated write
CREATE POLICY "Anyone can view blockchain verifications" ON blockchain_verifications
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert blockchain verifications" ON blockchain_verifications
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create views for easier querying
CREATE VIEW disaster_reports_with_profiles AS
SELECT 
    dr.*,
    p.username,
    p.avatar_url,
    p.full_name
FROM disaster_reports dr
LEFT JOIN profiles p ON dr.reporter_id = p.id;

CREATE VIEW emergency_alerts_with_profiles AS
SELECT 
    ea.*,
    p.username,
    p.avatar_url,
    p.full_name
FROM emergency_alerts ea
LEFT JOIN profiles p ON ea.user_id = p.id;

-- Create function to get disaster statistics
CREATE OR REPLACE FUNCTION get_disaster_statistics(
    days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
    total_reports BIGINT,
    reports_by_type JSONB,
    reports_by_severity JSONB,
    reports_by_status JSONB,
    recent_reports_24h BIGINT,
    high_risk_areas JSONB
) AS $$
DECLARE
    start_date TIMESTAMPTZ;
BEGIN
    start_date := NOW() - (days_back || ' days')::INTERVAL;
    
    RETURN QUERY
    SELECT 
        COUNT(*) as total_reports,
        jsonb_object_agg(disaster_type, type_count) as reports_by_type,
        jsonb_object_agg(severity, severity_count) as reports_by_severity,
        jsonb_object_agg(status, status_count) as reports_by_status,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as recent_reports_24h,
        jsonb_agg(
            jsonb_build_object(
                'latitude', latitude,
                'longitude', longitude,
                'count', location_count
            )
        ) as high_risk_areas
    FROM (
        SELECT 
            disaster_type,
            severity,
            status,
            latitude,
            longitude,
            COUNT(*) as type_count,
            COUNT(*) as severity_count,
            COUNT(*) as status_count,
            COUNT(*) as location_count
        FROM disaster_reports
        WHERE created_at >= start_date
        GROUP BY disaster_type, severity, status, latitude, longitude
    ) stats;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for testing
INSERT INTO profiles (id, username, full_name, bio, location) VALUES
    (uuid_generate_v4(), 'admin', 'System Administrator', 'ResQ Connect Admin', 'Guwahati, Assam'),
    (uuid_generate_v4(), 'testuser', 'Test User', 'Test user for development', 'Shillong, Meghalaya');

-- Insert sample danger zones
INSERT INTO danger_zones (name, polygon, zone_type, severity, description, created_by) VALUES
    (
        'Guwahati Flood Zone',
        ST_GeogFromText('POLYGON((91.7 26.1, 91.8 26.1, 91.8 26.2, 91.7 26.2, 91.7 26.1))'),
        'disaster',
        'high',
        'High-risk flood area during monsoon season',
        (SELECT id FROM profiles WHERE username = 'admin' LIMIT 1)
    ),
    (
        'Shillong Landslide Zone',
        ST_GeogFromText('POLYGON((91.8 25.5, 91.9 25.5, 91.9 25.6, 91.8 25.6, 91.8 25.5))'),
        'disaster',
        'critical',
        'Unstable hillside prone to landslides',
        (SELECT id FROM profiles WHERE username = 'admin' LIMIT 1)
    );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
