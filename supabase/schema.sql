-- 钓鱼脑 (FishingMind) 数据库 Schema
-- 运行此脚本在 Supabase SQL Editor 中

-- 1. 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nickname TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  region TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 钓点表
CREATE TABLE fishing_spots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  depth DECIMAL(10, 2),
  spot_type TEXT CHECK (spot_type IN ('lake', 'river', 'sea')),
  description TEXT,
  is_public BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 渔获记录表
CREATE TABLE fishing_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  fish_type TEXT NOT NULL,
  weight DECIMAL(10, 2),
  length DECIMAL(10, 2),
  spot_name TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  bait TEXT,
  notes TEXT,
  photo_url TEXT,
  weather TEXT,
  temperature DECIMAL(5, 2),
  is_public BOOLEAN DEFAULT true,
  blur_location BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 社区动态表
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  image_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  topic_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 动态点赞表
CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id),
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 6. 动态评论表
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id),
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 竞赛表
CREATE TABLE contests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  contest_type TEXT CHECK (contest_type IN ('weight', 'count', 'skill')),
  prize TEXT,
  cover_emoji TEXT,
  max_participants INTEGER,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  status TEXT CHECK (status IN ('draft', 'active', 'ended')) DEFAULT 'draft',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. 竞赛参赛表
CREATE TABLE contest_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contest_id UUID REFERENCES contests(id),
  user_id UUID REFERENCES users(id),
  fish_log_id UUID REFERENCES fishing_logs(id),
  score DECIMAL(10, 2),
  rank INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(contest_id, user_id)
);

-- 9. 排行榜
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  total_catches INTEGER DEFAULT 0,
  total_weight DECIMAL(10, 2) DEFAULT 0,
  contest_wins INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  region TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. 用户成就表
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  achievement_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_fishing_logs_user ON fishing_logs(user_id);
CREATE INDEX idx_fishing_logs_created ON fishing_logs(created_at DESC);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_contest_status ON contests(status);
CREATE INDEX idx_leaderboard_points ON leaderboard(points DESC);

-- RLS 策略
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE fishing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contests ENABLE ROW LEVEL SECURITY;

-- 用户可以查看所有公开用户
CREATE POLICY "Users are viewable" ON users FOR SELECT USING (true);

-- 用户只能查看公开的渔获记录
CREATE POLICY "Public logs viewable" ON fishing_logs FOR SELECT USING (is_public = true);

-- 用户可以创建自己的渔获记录
CREATE POLICY "Users create logs" ON fishing_logs FOR INSERT WITH CHECK (true);

-- 所有人都可以查看进行中的竞赛
CREATE POLICY "Active contests viewable" ON contests FOR SELECT USING (status = 'active');
