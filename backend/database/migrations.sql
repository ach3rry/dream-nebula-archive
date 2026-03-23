-- YashanDB 数据库建表脚本
-- 梦境星云档案馆 - Dream Nebula Archive
-- YashanDB AI Application Challenge

-- =====================================================
-- 1. 梦境记录主表
-- =====================================================
CREATE TABLE dream_records (
    id NUMBER(10) PRIMARY KEY,
    user_id NUMBER(10) NOT NULL,
    content CLOB NOT NULL,                    -- 原始梦境文本
    title VARCHAR2(200),                      -- AI 生成的标题
    emotion_type VARCHAR2(50),                -- 情感类型：平静/悲伤/恐惧/兴奋/焦虑/忧郁/愉悦
    emotion_score NUMBER(5,2),                -- 情感强度 -1.0~1.0
    emotion_confidence NUMBER(5,2),           -- 情感置信度 0.0~1.0
    keywords CLOB,                            -- JSON 格式关键词数组
    dream_image_url VARCHAR2(500),            -- 程序化生成的星云图 URL
    interpretation CLOB,                      -- AI 解梦报告
    is_private NUMBER(1) DEFAULT 1,           -- 是否私密：1=是, 0=否
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_dream_user_id ON dream_records(user_id);
CREATE INDEX idx_dream_emotion ON dream_records(emotion_type);
CREATE INDEX idx_dream_created_at ON dream_records(created_at);

-- 创建序列
CREATE SEQUENCE seq_dream_records START WITH 1 INCREMENT BY 1;


-- =====================================================
-- 2. 梦境标签关联表
-- =====================================================
CREATE TABLE dream_tags (
    id NUMBER(10) PRIMARY KEY,
    dream_id NUMBER(10) NOT NULL,
    tag_name VARCHAR2(100) NOT NULL,
    tag_category VARCHAR2(50),                -- 标签类别：元素/场景/情绪/其他
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dream_tags_dream_id FOREIGN KEY (dream_id)
        REFERENCES dream_records(id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX idx_tags_dream_id ON dream_tags(dream_id);
CREATE INDEX idx_tags_name ON dream_tags(tag_name);
CREATE INDEX idx_tags_category ON dream_tags(tag_category);

-- 创建序列
CREATE SEQUENCE seq_dream_tags START WITH 1 INCREMENT BY 1;


-- =====================================================
-- 3. 用户心理档案表
-- =====================================================
CREATE TABLE user_profiles (
    id NUMBER(10) PRIMARY KEY,
    user_id NUMBER(10) NOT NULL UNIQUE,
    total_dreams NUMBER(10) DEFAULT 0,
    dominant_emotion VARCHAR2(50),            -- 主导情感类型
    psychological_summary CLOB,              -- AI 生成的心理画像
    weather_forecast CLOB,                   -- 心理天气预报 JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_profiles_user_id ON user_profiles(user_id);

-- 创建序列
CREATE SEQUENCE seq_user_profiles START WITH 1 INCREMENT BY 1;


-- =====================================================
-- 4. 情感分析历史表
-- =====================================================
CREATE TABLE emotion_history (
    id NUMBER(10) PRIMARY KEY,
    user_id NUMBER(10) NOT NULL,
    record_date DATE NOT NULL,
    avg_emotion_score NUMBER(5,2),           -- 平均情感分数
    emotion_distribution CLOB,               -- JSON 格式情感分布
    dream_count NUMBER(10) DEFAULT 0,        -- 当天梦境数量
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_emotion_history_user_id ON emotion_history(user_id);
CREATE INDEX idx_emotion_history_date ON emotion_history(record_date);
CREATE UNIQUE INDEX idx_emotion_history_user_date ON emotion_history(user_id, record_date);

-- 创建序列
CREATE SEQUENCE seq_emotion_history START WITH 1 INCREMENT BY 1;


-- =====================================================
-- 初始化测试数据（可选）
-- =====================================================

-- 插入测试用户档案
INSERT INTO user_profiles (id, user_id, total_dreams, dominant_emotion)
VALUES (seq_user_profiles.NEXTVAL, 1, 0, NULL);

COMMIT;

-- 查看表结构
SELECT table_name, column_name, data_type, data_length
FROM user_tab_columns
WHERE table_name IN ('DREAM_RECORDS', 'DREAM_TAGS', 'USER_PROFILES', 'EMOTION_HISTORY')
ORDER BY table_name, column_id;
