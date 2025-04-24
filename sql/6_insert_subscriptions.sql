-- Insert subscription plans

INSERT INTO subscription_plans (
  id, name, description, frequency, discount_percentage, is_active
)
VALUES
  (
    '00000000-0000-0000-0000-000000000401',
    'Weekly',
    'Get your favorite products delivered every week. Perfect for regular consumers who want to ensure they never run out of their essential items.',
    'weekly',
    15,
    true
  ),
  (
    '00000000-0000-0000-0000-000000000402',
    'Biweekly',
    'Get your favorite products delivered every two weeks. A balanced option for moderate consumers.',
    'biweekly',
    12,
    true
  ),
  (
    '00000000-0000-0000-0000-000000000403',
    'Monthly',
    'Get your favorite products delivered every month. Ideal for occasional consumers or those who use our products sparingly.',
    'monthly',
    10,
    true
  ),
  (
    '00000000-0000-0000-0000-000000000404',
    'Quarterly',
    'Get your favorite products delivered every three months. Perfect for those who stock up on non-perishable items.',
    'quarterly',
    8,
    true
  );
