insert into app_user (id, display_name) values ('demo-user', '示例用户') on conflict (id) do nothing;
insert into wealth_profile (id, user_id, name, age_range, city, job, marital_status, children, total_asset, total_debt, monthly_income, monthly_expense, confidence, risk_level, summary)
values ('p_demo', 'demo-user', '张先生', '31-35', '一线', '互联网', '已婚', '1孩 · 小学', 430, 145, 4.9, 3.35, 72, '中', '资产以房产为核心，收入能力较强，房贷与教育支出形成中等现金流压力。')
on conflict (id) do nothing;
insert into money_item (id, user_id, profile_id, category, name, amount, ratio, confidence) values
('m_house', 'demo-user', 'p_demo', 'asset', '房产', 310, 72, 78),
('m_invest', 'demo-user', 'p_demo', 'asset', '股票基金', 65, 15, 64),
('m_mortgage', 'demo-user', 'p_demo', 'debt', '房贷', 120, 83, 76),
('m_salary', 'demo-user', 'p_demo', 'income', '工资', 3.2, null, 72)
on conflict (id) do nothing;
insert into clue (id, user_id, profile_id, content, type, confidence, confirmed) values
('c_demo_side', 'demo-user', 'p_demo', '听说最近开始做副业，每月约6000', '收入', 'medium', true)
on conflict (id) do nothing;
insert into wealth_snapshot (id, user_id, profile_id, total_asset, total_debt, monthly_income, monthly_expense, confidence) values
('s_demo_202606', 'demo-user', 'p_demo', 430, 145, 4.9, 3.35, 72)
on conflict (id) do nothing;
