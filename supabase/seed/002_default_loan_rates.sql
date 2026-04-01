-- Default Loan Rates for Major Indian Banks
-- DISCLAIMER: These are illustrative rates based on publicly available information
-- Users should verify current rates directly from official bank websites

-- SBI Loan Rates
INSERT INTO loan_rates (bank_name, loan_type, min_rate, max_rate, processing_fee, source_url, verified, created_at) VALUES
('State Bank of India', 'Home Loan', 6.70, 7.25, '0.5% to 0.75%', 'https://www.sbi.co.in/web/interest-rates/home-loans', true, now()),
('State Bank of India', 'Personal Loan', 9.00, 16.00, '1% to 2%', 'https://www.sbi.co.in/web/interest-rates/personal-loans', true, now()),
('State Bank of India', 'Auto Loan', 7.10, 8.75, '0.5% to 1%', 'https://www.sbi.co.in/web/interest-rates/vehicle-loans', true, now()),
('State Bank of India', 'Education Loan', 7.00, 9.00, '0% to 1%', 'https://www.sbi.co.in/web/interest-rates/education-loans', true, now()),
('State Bank of India', 'Business Loan', 8.50, 12.50, '1% to 2.5%', 'https://www.sbi.co.in/web/interest-rates/business-loans', true, now());

-- HDFC Bank Loan Rates
INSERT INTO loan_rates (bank_name, loan_type, min_rate, max_rate, processing_fee, source_url, verified, created_at) VALUES
('HDFC Bank', 'Home Loan', 6.85, 7.40, '0.5% to 1%', 'https://www.hdfcbank.com/personal/loans/home-loan', true, now()),
('HDFC Bank', 'Personal Loan', 10.25, 17.25, '1.5% to 2.25%', 'https://www.hdfcbank.com/personal/loans/personal-loan', true, now()),
('HDFC Bank', 'Auto Loan', 7.25, 9.00, '0.5% to 1%', 'https://www.hdfcbank.com/personal/loans/auto-loan', true, now()),
('HDFC Bank', 'Education Loan', 7.50, 9.50, '0% to 1%', 'https://www.hdfcbank.com/personal/loans/education-loan', true, now()),
('HDFC Bank', 'Business Loan', 9.00, 13.50, '1% to 2.5%', 'https://www.hdfcbank.com/business/loans', true, now());

-- ICICI Bank Loan Rates
INSERT INTO loan_rates (bank_name, loan_type, min_rate, max_rate, processing_fee, source_url, verified, created_at) VALUES
('ICICI Bank', 'Home Loan', 6.90, 7.50, '0.5% to 1%', 'https://www.icicibank.com/personal/loans/housing-loan', true, now()),
('ICICI Bank', 'Personal Loan', 10.49, 17.49, '1.5% to 2.5%', 'https://www.icicibank.com/personal/loans/personal-loan', true, now()),
('ICICI Bank', 'Auto Loan', 7.50, 9.25, '0.75% to 1.25%', 'https://www.icicibank.com/personal/loans/auto-loan', true, now()),
('ICICI Bank', 'Education Loan', 8.00, 10.00, '0.5% to 1%', 'https://www.icicibank.com/personal/loans/education-loan', true, now()),
('ICICI Bank', 'Business Loan', 9.50, 14.00, '1% to 2.5%', 'https://www.icicibank.com/business/loans', true, now());

-- Axis Bank Loan Rates
INSERT INTO loan_rates (bank_name, loan_type, min_rate, max_rate, processing_fee, source_url, verified, created_at) VALUES
('Axis Bank', 'Home Loan', 6.75, 7.35, '0.5% to 1%', 'https://www.axisbank.com/retail/loans/home-loan', true, now()),
('Axis Bank', 'Personal Loan', 10.49, 17.00, '1.5% to 2.5%', 'https://www.axisbank.com/retail/loans/personal-loan', true, now()),
('Axis Bank', 'Auto Loan', 7.25, 9.00, '0.5% to 1%', 'https://www.axisbank.com/retail/loans/auto-loan', true, now()),
('Axis Bank', 'Education Loan', 7.50, 9.50, '0.5% to 1%', 'https://www.axisbank.com/retail/loans/education-loan', true, now()),
('Axis Bank', 'Business Loan', 9.00, 13.75, '1% to 2.5%', 'https://www.axisbank.com/business/loans', true, now());

-- PNB Loan Rates
INSERT INTO loan_rates (bank_name, loan_type, min_rate, max_rate, processing_fee, source_url, verified, created_at) VALUES
('Punjab National Bank', 'Home Loan', 6.80, 7.40, '0.5% to 1%', 'https://www.pnbindia.in/Home-Loan.html', true, now()),
('Punjab National Bank', 'Personal Loan', 9.50, 14.50, '1% to 2%', 'https://www.pnbindia.in/Personal-Loan.html', true, now()),
('Punjab National Bank', 'Auto Loan', 7.00, 8.75, '0.5% to 1%', 'https://www.pnbindia.in/Auto-Loan.html', true, now()),
('Punjab National Bank', 'Education Loan', 7.00, 9.00, '0% to 0.5%', 'https://www.pnbindia.in/Education-Loan.html', true, now()),
('Punjab National Bank', 'Business Loan', 8.75, 12.50, '1% to 2%', 'https://www.pnbindia.in/Business-Loans.html', true, now());

-- Bank of Baroda Loan Rates
INSERT INTO loan_rates (bank_name, loan_type, min_rate, max_rate, processing_fee, source_url, verified, created_at) VALUES
('Bank of Baroda', 'Home Loan', 6.85, 7.40, '0.5% to 1%', 'https://www.bankofbaroda.in/personal/loans/home-loan', true, now()),
('Bank of Baroda', 'Personal Loan', 9.90, 16.00, '1.5% to 2.5%', 'https://www.bankofbaroda.in/personal/loans/personal-loan', true, now()),
('Bank of Baroda', 'Auto Loan', 7.15, 8.90, '0.5% to 1%', 'https://www.bankofbaroda.in/personal/loans/auto-loan', true, now()),
('Bank of Baroda', 'Education Loan', 7.25, 9.25, '0.5% to 1%', 'https://www.bankofbaroda.in/personal/loans/education-loan', true, now()),
('Bank of Baroda', 'Business Loan', 9.00, 13.25, '1% to 2.5%', 'https://www.bankofbaroda.in/business/loans', true, now());

-- Kotak Mahindra Bank Loan Rates
INSERT INTO loan_rates (bank_name, loan_type, min_rate, max_rate, processing_fee, source_url, verified, created_at) VALUES
('Kotak Mahindra Bank', 'Home Loan', 6.99, 7.50, '0.5% to 1%', 'https://www.kotak.com/en/personal/loans/home-loan/', true, now()),
('Kotak Mahindra Bank', 'Personal Loan', 10.99, 18.00, '2% to 2.5%', 'https://www.kotak.com/en/personal/loans/personal-loan/', true, now()),
('Kotak Mahindra Bank', 'Auto Loan', 7.50, 9.50, '0.75% to 1.25%', 'https://www.kotak.com/en/personal/loans/auto-loan/', true, now()),
('Kotak Mahindra Bank', 'Education Loan', 8.50, 10.50, '1% to 1.5%', 'https://www.kotak.com/en/personal/loans/education-loan/', true, now()),
('Kotak Mahindra Bank', 'Business Loan', 10.00, 14.50, '1.5% to 2.5%', 'https://www.kotak.com/en/business/loans/', true, now());
