-- Default Income Categories
INSERT INTO categories (name, type, icon, color, is_default, sort_order) VALUES
('Salary', 'income', '💰', '#10B981', true, 1),
('Bonus', 'income', '🎁', '#F59E0B', true, 2),
('Freelance', 'income', '💼', '#3B82F6', true, 3),
('Business', 'income', '🏪', '#8B5CF6', true, 4),
('Interest', 'income', '📈', '#06B6D4', true, 5),
('Rental Income', 'income', '🏠', '#EC4899', true, 6),
('Dividends', 'income', '📊', '#14B8A6', true, 7),
('Refunds', 'income', '♻️', '#6366F1', true, 8),
('Gifts Received', 'income', '🎉', '#EF4444', true, 9),
('Other Income', 'income', '⭐', '#6B7280', true, 10);

-- Default Expense Categories - Loans & EMI
INSERT INTO categories (name, type, icon, color, is_default, sort_order) VALUES
('House Rent', 'expense', '🏘️', '#1F2937', true, 11),
('Home Loan EMI', 'expense', '🏡', '#374151', true, 12),
('Personal Loan EMI', 'expense', '📝', '#4B5563', true, 13),
('Vehicle Loan EMI', 'expense', '🚗', '#6B7280', true, 14),
('Education Loan EMI', 'expense', '🎓', '#8B95A5', true, 15),
('Property Loan EMI', 'expense', '🏢', '#9CA3AF', true, 16);

-- Default Expense Categories - Groceries & Food
INSERT INTO categories (name, type, icon, color, is_default, sort_order) VALUES
('Groceries', 'expense', '🛒', '#10B981', true, 17),
('Milk', 'expense', '🥛', '#F3F4F6', true, 18),
('Vegetables', 'expense', '🥬', '#34D399', true, 19),
('Fruits', 'expense', '🍎', '#6EE7B7', true, 20),
('Dining Out', 'expense', '🍽️', '#FF6B6B', true, 21),
('Tea/Coffee', 'expense', '☕', '#D4A574', true, 22);

-- Default Expense Categories - Utilities & Bills
INSERT INTO categories (name, type, icon, color, is_default, sort_order) VALUES
('Gas Cylinder', 'expense', '⛽', '#F59E0B', true, 23),
('Electricity Bill', 'expense', '⚡', '#FBBF24', true, 24),
('Water Bill', 'expense', '💧', '#3B82F6', true, 25),
('Maintenance Charges', 'expense', '🔧', '#8B5CF6', true, 26),
('Internet/WiFi', 'expense', '📶', '#06B6D4', true, 27),
('Mobile Recharge', 'expense', '📱', '#EC4899', true, 28),
('DTH/OTT', 'expense', '📺', '#14B8A6', true, 29);

-- Default Expense Categories - Transportation
INSERT INTO categories (name, type, icon, color, is_default, sort_order) VALUES
('Fuel/Petrol/Diesel', 'expense', '⛽', '#EF4444', true, 30),
('Public Transport', 'expense', '🚌', '#F97316', true, 31),
('Cab/Auto', 'expense', '🚕', '#FBBF24', true, 32),
('Train', 'expense', '🚆', '#84CC16', true, 33),
('Flight', 'expense', '✈️', '#0EA5E9', true, 34),
('Toll/Parking', 'expense', '🅿️', '#8B5CF6', true, 35),
('Car Service', 'expense', '🚗', '#06B6D4', true, 36),
('Bike Service', 'expense', '🏍️', '#EC4899', true, 37);

-- Default Expense Categories - Insurance
INSERT INTO categories (name, type, icon, color, is_default, sort_order) VALUES
('Insurance', 'expense', '🛡️', '#EF4444', true, 38),
('Health Insurance', 'expense', '🏥', '#F87171', true, 39),
('Life Insurance', 'expense', '💚', '#FCA5A5', true, 40);

-- Default Expense Categories - Investments
INSERT INTO categories (name, type, icon, color, is_default, sort_order) VALUES
('SIP/Mutual Funds', 'expense', '📈', '#10B981', true, 41),
('Stocks', 'expense', '📊', '#34D399', true, 42),
('PPF', 'expense', '🏦', '#6EE7B7', true, 43),
('NPS', 'expense', '📋', '#A7F3D0', true, 44),
('EPF Voluntary', 'expense', '💼', '#D1FAE5', true, 45),
('Gold Purchase', 'expense', '🪙', '#FFD700', true, 46),
('Jewellery', 'expense', '💎', '#FFC0CB', true, 47);

-- Default Expense Categories - Health & Wellness
INSERT INTO categories (name, type, icon, color, is_default, sort_order) VALUES
('Medical', 'expense', '💊', '#EF4444', true, 48),
('Pharmacy', 'expense', '💉', '#F87171', true, 49),
('Doctor Consultation', 'expense', '👨‍⚕️', '#FCA5A5', true, 50),
('Hospital', 'expense', '🏥', '#FECACA', true, 51),
('Fitness/Gym', 'expense', '💪', '#10B981', true, 52),
('Beauty/Salon', 'expense', '💇', '#34D399', true, 53);

-- Default Expense Categories - Shopping & Personal
INSERT INTO categories (name, type, icon, color, is_default, sort_order) VALUES
('Clothing', 'expense', '👕', '#8B5CF6', true, 54),
('Footwear', 'expense', '👞', '#A78BFA', true, 55),
('Gadgets', 'expense', '📱', '#DDD6FE', true, 56),
('Electronics', 'expense', '⚙️', '#EDE9FE', true, 57);

-- Default Expense Categories - Education
INSERT INTO categories (name, type, icon, color, is_default, sort_order) VALUES
('Education Fees', 'expense', '🎓', '#3B82F6', true, 58),
('Books/Courses', 'expense', '📚', '#60A5FA', true, 59),
('Child Expenses', 'expense', '👶', '#93C5FD', true, 60);

-- Default Expense Categories - Family & Support
INSERT INTO categories (name, type, icon, color, is_default, sort_order) VALUES
('Parents Support', 'expense', '👴', '#EC4899', true, 61),
('Domestic Help', 'expense', '👩‍🍳', '#F472B6', true, 62);

-- Default Expense Categories - Charity & Religious
INSERT INTO categories (name, type, icon, color, is_default, sort_order) VALUES
('Temple/Religious', 'expense', '🕉️', '#F59E0B', true, 63),
('Charity/Donation', 'expense', '🤝', '#FBBF24', true, 64);

-- Default Expense Categories - Subscriptions & Entertainment
INSERT INTO categories (name, type, icon, color, is_default, sort_order) VALUES
('Subscriptions', 'expense', '🔔', '#06B6D4', true, 65),
('Entertainment', 'expense', '🎬', '#0EA5E9', true, 66),
('Travel', 'expense', '✈️', '#0284C7', true, 67),
('Hotel', 'expense', '🏨', '#0369A1', true, 68),
('Shopping', 'expense', '🛍️', '#8B5CF6', true, 69);

-- Default Expense Categories - Payments & Taxes
INSERT INTO categories (name, type, icon, color, is_default, sort_order) VALUES
('Credit Card Bill', 'expense', '💳', '#1F2937', true, 70),
('Taxes', 'expense', '📊', '#374151', true, 71),
('Professional Tax', 'expense', '💼', '#4B5563', true, 72),
('TDS/Tax Advance', 'expense', '🏛️', '#6B7280', true, 73),
('Miscellaneous', 'expense', '❓', '#9CA3AF', true, 74);

-- Default Transfer Category
INSERT INTO categories (name, type, icon, color, is_default, sort_order) VALUES
('Account Transfer', 'transfer', '🔄', '#06B6D4', true, 75);
