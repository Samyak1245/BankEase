-- Sample data for banking_db (fictional Indian names and INR amounts)
-- Account balances are set directly for the demo dashboard.
-- New deposits/withdrawals in the app will update both accounts and transactions.
USE banking_db;

-- Branches
INSERT INTO branches (branch_name, city, address) VALUES
('Andheri West Branch', 'Mumbai', '12 SV Road, Andheri West'),
('Connaught Place Branch', 'Delhi', '44 Janpath, Connaught Place'),
('Koramangala Branch', 'Bengaluru', '80 Feet Road, Koramangala'),
('T Nagar Branch', 'Chennai', '5 Usman Road, T Nagar'),
('Salt Lake Branch', 'Kolkata', 'Sector V, Salt Lake'),
('Banjara Hills Branch', 'Hyderabad', 'Road No. 12, Banjara Hills');

-- Customers (12)
INSERT INTO customers (name, email, phone, address, date_of_birth) VALUES
('Rahul Sharma', 'rahul.sharma@example.com', '9876500001', 'Bandra, Mumbai', '1994-03-12'),
('Priya Patel', 'priya.patel@example.com', '9876500002', 'Navrangpura, Ahmedabad', '1996-07-21'),
('Amit Kumar', 'amit.kumar@example.com', '9876500003', 'Patna City, Patna', '1990-11-05'),
('Sneha Reddy', 'sneha.reddy@example.com', '9876500004', 'Jubilee Hills, Hyderabad', '1998-01-18'),
('Vikram Singh', 'vikram.singh@example.com', '9876500005', 'Civil Lines, Jaipur', '1988-09-09'),
('Ananya Iyer', 'ananya.iyer@example.com', '9876500006', 'Adyar, Chennai', '1995-04-30'),
('Rohan Gupta', 'rohan.gupta@example.com', '9876500007', 'Gomti Nagar, Lucknow', '1992-12-14'),
('Kavita Nair', 'kavita.nair@example.com', '9876500008', 'Marine Drive, Kochi', '1993-06-02'),
('Arjun Mehta', 'arjun.mehta@example.com', '9876500009', 'Satellite, Ahmedabad', '1989-02-25'),
('Deepika Joshi', 'deepika.joshi@example.com', '9876500010', 'Shivaji Nagar, Pune', '1997-08-11'),
('Sanjay Verma', 'sanjay.verma@example.com', '9876500011', 'Hazratganj, Lucknow', '1985-05-19'),
('Meera Krishnan', 'meera.krishnan@example.com', '9876500012', 'Indiranagar, Bengaluru', '1991-10-08');

-- Accounts (12) - balances match later deposits minus withdrawals
INSERT INTO accounts (customer_id, account_type, balance, opening_date, status) VALUES
(1, 'Savings', 45000.00, '2023-01-15', 'Active'),
(2, 'Current', 125000.00, '2023-02-10', 'Active'),
(3, 'Savings', 18000.00, '2023-03-05', 'Active'),
(4, 'Savings', 72000.00, '2023-03-22', 'Active'),
(5, 'Current', 210000.00, '2023-04-12', 'Active'),
(6, 'Savings', 33500.00, '2023-05-01', 'Active'),
(7, 'Savings', 9000.00, '2023-05-18', 'Frozen'),
(8, 'Current', 56000.00, '2023-06-09', 'Active'),
(9, 'Savings', 41000.00, '2023-07-21', 'Active'),
(10, 'Savings', 27500.00, '2023-08-14', 'Active'),
(11, 'Current', 88000.00, '2023-09-03', 'Active'),
(12, 'Savings', 15200.00, '2023-10-11', 'Active');

-- Transactions (22)
INSERT INTO transactions (account_id, transaction_type, amount, transaction_date, description) VALUES
(1, 'Deposit', 20000.00, '2024-01-05 10:15:00', 'Salary credit'),
(1, 'Withdraw', 5000.00, '2024-01-12 16:40:00', 'ATM withdrawal'),
(1, 'Deposit', 30000.00, '2024-02-01 09:20:00', 'Salary credit'),
(2, 'Deposit', 80000.00, '2024-01-08 11:00:00', 'Business receipt'),
(2, 'Withdraw', 15000.00, '2024-01-20 14:10:00', 'Vendor payment'),
(2, 'Deposit', 60000.00, '2024-02-08 11:05:00', 'Business receipt'),
(3, 'Deposit', 12000.00, '2024-01-15 12:30:00', 'Cash deposit'),
(3, 'Withdraw', 2000.00, '2024-01-28 18:00:00', 'UPI transfer'),
(4, 'Deposit', 50000.00, '2024-02-02 10:45:00', 'Family transfer'),
(4, 'Withdraw', 8000.00, '2024-02-14 13:25:00', 'Shopping'),
(5, 'Deposit', 150000.00, '2024-01-10 09:00:00', 'Contract payment'),
(5, 'Withdraw', 40000.00, '2024-01-22 15:50:00', 'Office expenses'),
(6, 'Deposit', 25000.00, '2024-02-05 17:10:00', 'Salary credit'),
(6, 'Withdraw', 3500.00, '2024-02-18 19:05:00', 'Utility bills'),
(7, 'Deposit', 9000.00, '2024-01-19 10:00:00', 'Cash deposit'),
(8, 'Deposit', 40000.00, '2024-02-07 11:40:00', 'Client payment'),
(8, 'Withdraw', 10000.00, '2024-02-21 16:15:00', 'Rent'),
(9, 'Deposit', 22000.00, '2024-03-01 09:35:00', 'Salary credit'),
(10, 'Deposit', 18000.00, '2024-03-04 12:00:00', 'Cheque deposit'),
(10, 'Withdraw', 4500.00, '2024-03-12 18:20:00', 'Medical expense'),
(11, 'Deposit', 50000.00, '2024-03-06 10:10:00', 'Business receipt'),
(12, 'Deposit', 15200.00, '2024-03-09 14:55:00', 'Opening deposit');

-- Loans (6)
INSERT INTO loans (customer_id, loan_type, loan_amount, interest_rate, tenure_months, status, application_date) VALUES
(1, 'Home', 2500000.00, 8.50, 240, 'Approved', '2024-01-20'),
(2, 'Vehicle', 650000.00, 9.25, 60, 'Approved', '2024-02-02'),
(4, 'Education', 400000.00, 7.90, 48, 'Pending', '2024-03-01'),
(6, 'Personal', 150000.00, 12.00, 24, 'Approved', '2024-02-15'),
(9, 'Home', 1800000.00, 8.75, 180, 'Rejected', '2024-01-28'),
(11, 'Vehicle', 520000.00, 9.10, 48, 'Pending', '2024-03-10');

-- Loan payments
INSERT INTO loan_payments (loan_id, amount, payment_date, payment_status) VALUES
(1, 22000.00, '2024-02-20', 'Paid'),
(1, 22000.00, '2024-03-20', 'Paid'),
(2, 12500.00, '2024-03-02', 'Paid'),
(2, 12500.00, '2024-04-02', 'Paid'),
(4, 7000.00, '2024-03-15', 'Paid'),
(4, 7000.00, '2024-04-15', 'Paid');

-- Employees
INSERT INTO employees (branch_id, name, role, email) VALUES
(1, 'Neha Kulkarni', 'Branch Manager', 'neha.kulkarni@bank.example'),
(1, 'Farhan Shaikh', 'Cashier', 'farhan.shaikh@bank.example'),
(2, 'Pooja Malhotra', 'Branch Manager', 'pooja.malhotra@bank.example'),
(2, 'Rakesh Yadav', 'Clerk', 'rakesh.yadav@bank.example'),
(3, 'Harish Rao', 'Loan Officer', 'harish.rao@bank.example'),
(3, 'Divya Shetty', 'Cashier', 'divya.shetty@bank.example'),
(4, 'Karthik Subramanian', 'Branch Manager', 'karthik.s@bank.example'),
(5, 'Ankit Chatterjee', 'Clerk', 'ankit.chatterjee@bank.example'),
(6, 'Fatima Begum', 'Loan Officer', 'fatima.begum@bank.example'),
(6, 'Suresh Naidu', 'Cashier', 'suresh.naidu@bank.example');
