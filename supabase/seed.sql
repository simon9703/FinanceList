-- supabase/seed.sql
-- 该文件基于 lib/demo-data.ts 生成，用于填充基础测试数据

-- 注意：由于所有表都有外键关联 auth.users(id)，这里统一使用了一个测试用的固定 UUID
-- 如果您要在生产环境或云端环境执行，请确保您有一个实际的 user_id，并将下方的 UUID 替换掉。
-- 这里的示例 UUID 为：'00000000-0000-0000-0000-000000000000'

-- 0. 先在 auth.users 插入 Demo 用户，以免触发外键约束
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'demo@example.com',
  crypt('password123', gen_salt('bf')),
  current_timestamp,
  current_timestamp,
  current_timestamp,
  '{"provider":"email","providers":["email"]}',
  '{}',
  current_timestamp,
  current_timestamp,
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  format('{"sub":"%s","email":"%s"}', '00000000-0000-0000-0000-000000000000', 'demo@example.com')::jsonb,
  'email',
  'demo@example.com',
  current_timestamp,
  current_timestamp,
  current_timestamp
) ON CONFLICT DO NOTHING;

-- 1. 插入应用基础用户 app_user 
INSERT INTO app_user (id, display_name, created_at)
VALUES ('00000000-0000-0000-0000-000000000000', 'Demo User', now())
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 wealth_profile 数据
INSERT INTO wealth_profile (id, user_id, name, age_range, city, job, marital_status, children, total_asset, total_debt, monthly_income, monthly_expense, confidence, created_at, updated_at)
VALUES 
('p_demo', '00000000-0000-0000-0000-000000000000', '张先生', '38岁', '上海', '互联网从业者', '已婚', '已婚有子（2岁）', 2850000, 1450000, 32000, 21000, 86, '2026-06-01T00:00:00.000Z', '2026-06-16T00:00:00.000Z'),
('p_demo_2', '00000000-0000-0000-0000-000000000000', '李女士', '29岁', '北京', '教师', '未婚', '未婚', 1680000, 420000, 18000, 11500, 78, '2026-05-18T00:00:00.000Z', '2026-06-14T00:00:00.000Z'),
('p_demo_3', '00000000-0000-0000-0000-000000000000', '王先生', '45岁', '深圳', '企业主', '已婚', '已婚有女（8岁）', 4120000, 2100000, 56000, 38000, 68, '2026-04-20T00:00:00.000Z', '2026-06-12T00:00:00.000Z')
ON CONFLICT (id) DO NOTHING;

-- 3. 插入 money_item 数据
INSERT INTO money_item (id, user_id, profile_id, category, name, amount, ratio, confidence)
VALUES
('m1', '00000000-0000-0000-0000-000000000000', 'p_demo', 'asset', '房产', 1653000, 58, 78),
('m2', '00000000-0000-0000-0000-000000000000', 'p_demo', 'asset', '投资', 684000, 24, 64),
('m3', '00000000-0000-0000-0000-000000000000', 'p_demo', 'asset', '现金及活期', 228000, 8, 82),
('m4', '00000000-0000-0000-0000-000000000000', 'p_demo', 'asset', '车辆', 285000, 10, 70),
('m5', '00000000-0000-0000-0000-000000000000', 'p_demo', 'debt', '房贷', 1200000, 83, 76),
('m6', '00000000-0000-0000-0000-000000000000', 'p_demo', 'debt', '消费贷', 180000, 12, 62),
('m7', '00000000-0000-0000-0000-000000000000', 'p_demo', 'debt', '信用卡', 70000, 5, 58),
('m8', '00000000-0000-0000-0000-000000000000', 'p_demo', 'income', '工资薪资', 25000, 78, 72),
('m9', '00000000-0000-0000-0000-000000000000', 'p_demo', 'income', '奖金/补贴', 7000, 22, 65),
('m10', '00000000-0000-0000-0000-000000000000', 'p_demo', 'expense', '居住', 6000, 29, 66),
('m11', '00000000-0000-0000-0000-000000000000', 'p_demo', 'expense', '餐饮', 3500, 17, 64),
('m19', '00000000-0000-0000-0000-000000000000', 'p_demo', 'expense', '交通', 2500, 12, 62),
('m20', '00000000-0000-0000-0000-000000000000', 'p_demo', 'expense', '教育', 2000, 10, 60),
('m21', '00000000-0000-0000-0000-000000000000', 'p_demo', 'expense', '其他', 7000, 32, 58),
('m12', '00000000-0000-0000-0000-000000000000', 'p_demo_2', 'asset', '房产', 980000, 58, 72),
('m13', '00000000-0000-0000-0000-000000000000', 'p_demo_2', 'asset', '投资', 380000, 23, 68),
('m14', '00000000-0000-0000-0000-000000000000', 'p_demo_2', 'asset', '现金', 120000, 7, 70),
('m15', '00000000-0000-0000-0000-000000000000', 'p_demo_2', 'asset', '保险', 200000, 12, 62),
('m16', '00000000-0000-0000-0000-000000000000', 'p_demo_2', 'debt', '房贷', 420000, 100, 76),
('m17', '00000000-0000-0000-0000-000000000000', 'p_demo_2', 'income', '工资薪资', 18000, 100, 74),
('m18', '00000000-0000-0000-0000-000000000000', 'p_demo_2', 'expense', '家庭支出', 11500, 100, 66),
('m22', '00000000-0000-0000-0000-000000000000', 'p_demo_3', 'asset', '公司股权', 1900000, 46, 58),
('m23', '00000000-0000-0000-0000-000000000000', 'p_demo_3', 'asset', '房产', 1400000, 34, 70),
('m24', '00000000-0000-0000-0000-000000000000', 'p_demo_3', 'asset', '车辆', 360000, 9, 64),
('m25', '00000000-0000-0000-0000-000000000000', 'p_demo_3', 'asset', '现金', 460000, 11, 62),
('m26', '00000000-0000-0000-0000-000000000000', 'p_demo_3', 'debt', '经营贷', 1500000, 71, 54),
('m27', '00000000-0000-0000-0000-000000000000', 'p_demo_3', 'debt', '房贷', 600000, 29, 66),
('m28', '00000000-0000-0000-0000-000000000000', 'p_demo_3', 'income', '经营收入', 56000, 100, 58),
('m29', '00000000-0000-0000-0000-000000000000', 'p_demo_3', 'expense', '家庭及经营支出', 38000, 100, 55)
ON CONFLICT (id) DO NOTHING;

-- 4. 插入 clue 数据
INSERT INTO clue (id, user_id, profile_id, content, type, confidence, confirmed, hidden, parsed_result, created_at, updated_at)
VALUES
('c1', '00000000-0000-0000-0000-000000000000', 'p_demo', '刚收到年终奖8万元，打算拿出4万元投资指数基金，另外信用卡还了7000元。', 'income', 'high', true, false, '[{"type": "income", "item": "年终奖收入", "amount": 80000, "amountText": "80,000元", "confidence": "high", "explanation": "识别依据：年终奖8万元", "impacts": [{"label": "收入", "target": "income", "deltaText": "+80,000元"}]}, {"type": "asset", "item": "投资指数基金", "amount": 40000, "amountText": "40,000元", "confidence": "medium", "explanation": "识别依据：拿出4万元投资指数基金", "impacts": [{"label": "资产", "target": "asset", "deltaText": "+40,000元"}]}, {"type": "debt", "item": "信用卡还款", "amount": 7000, "amountText": "7,000元", "confidence": "medium", "explanation": "识别依据：信用卡还了7000元", "impacts": [{"label": "负债", "target": "debt", "deltaText": "-7,000元"}]}]'::jsonb, '2026-06-16T00:00:00.000Z', '2026-06-16T00:00:00.000Z')
ON CONFLICT (id) DO NOTHING;

-- 5. 插入 wealth_snapshot 数据
INSERT INTO wealth_snapshot (id, user_id, profile_id, total_asset, total_debt, monthly_income, monthly_expense, confidence, created_at)
VALUES
('s1', '00000000-0000-0000-0000-000000000000', 'p_demo', 2100000, 1360000, 28000, 19000, 72, '2025-06-16T00:00:00.000Z'),
('s2', '00000000-0000-0000-0000-000000000000', 'p_demo', 2360000, 1400000, 30000, 20500, 78, '2025-12-16T00:00:00.000Z'),
('s3', '00000000-0000-0000-0000-000000000000', 'p_demo', 2600000, 1420000, 31000, 20800, 82, '2026-03-16T00:00:00.000Z'),
('s4', '00000000-0000-0000-0000-000000000000', 'p_demo', 2850000, 1450000, 32000, 21000, 86, '2026-06-16T00:00:00.000Z'),
('s5', '00000000-0000-0000-0000-000000000000', 'p_demo_2', 1280000, 460000, 16000, 10000, 68, '2025-06-16T00:00:00.000Z'),
('s6', '00000000-0000-0000-0000-000000000000', 'p_demo_2', 1680000, 420000, 18000, 11500, 78, '2026-06-16T00:00:00.000Z'),
('s7', '00000000-0000-0000-0000-000000000000', 'p_demo_3', 3500000, 1980000, 48000, 34000, 62, '2025-06-16T00:00:00.000Z'),
('s8', '00000000-0000-0000-0000-000000000000', 'p_demo_3', 4120000, 2100000, 56000, 38000, 68, '2026-06-16T00:00:00.000Z')
ON CONFLICT (id) DO NOTHING;
