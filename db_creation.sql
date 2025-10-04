CREATE TABLE users (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    age INT,
    role VARCHAR(20) DEFAULT 'none' CHECK (role IN ('user','admin', 'none')),
	level VARCHAR(20) CHECK (level IN ('beginner', 'intermediate', 'expert')),
    verification_code VARCHAR(6),
    verification_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE labels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    x_axis VARCHAR(50) NOT NULL,
    y_axis VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES users(uuid) ON DELETE CASCADE,
    imageName INT REFERENCES spaceImages(id) ON DELETE CASCADE,
    visibility VARCHAR(20) 
);