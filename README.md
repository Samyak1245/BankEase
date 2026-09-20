# Banking Management System

College DBMS mini-project built with **Node.js**, **Express**, **EJS**, and **MySQL**.

This is a simple admin dashboard for customers, accounts, deposits/withdrawals, loans, loan payments, branches, and employees. It is **not** a real banking product.

## Tech stack

- Backend: Node.js + Express (MVC)
- Views: EJS + express-ejs-layouts
- CSS: custom stylesheet + Bootstrap 5 CDN
- Database: MySQL (`mysql2`)

## How to run

### 1. Install MySQL

Make sure MySQL Server is installed and running on your computer (MySQL 8 recommended).

### 2. Create the database and tables

Open MySQL Command Line Client, MySQL Workbench, or PowerShell and run:

```sql
SOURCE C:/Users/SHAMIK/banking-management-system/database/schema.sql;
```

Or from a terminal (change the path/user if needed):

```bash
mysql -u root -p < database/schema.sql
```

This creates the database `banking_db`, all 7 tables, foreign keys, indexes, a VIEW, a TRIGGER, and a STORED PROCEDURE.

### 3. Load sample data

```sql
SOURCE C:/Users/SHAMIK/banking-management-system/database/sample_data.sql;
```

Or:

```bash
mysql -u root -p < database/sample_data.sql
```

Sample data includes fictional Indian names and INR amounts (not real personal data).

### 4. Configure `.env`

Open `.env` in this folder and set your MySQL password:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=banking_db
PORT=3000
```

Do not commit the real password. `.env` is listed in `.gitignore`.

### 5. Install packages and start the server

```bash
cd banking-management-system
npm install
npm start
```

You can also run:

```bash
node app.js
```

### 6. Open the application

Browser: [http://localhost:3000](http://localhost:3000)

## Pages

| Page | URL |
| --- | --- |
| Dashboard | `/` |
| Customers | `/customers` |
| Accounts | `/accounts` |
| Transactions | `/transactions` |
| Loans | `/loans` |
| Loan Payments | `/loan-payments` |
| Branches | `/branches` |
| Employees | `/employees` |

Logout is a demo link only. There is no login system.

## Useful MySQL demos for viva

```sql
USE banking_db;

-- VIEW (COUNT, SUM, AVG, GROUP BY, JOIN)
SELECT * FROM vw_customer_account_summary;

-- STORED PROCEDURE (subquery)
CALL sp_customer_total_balance(1);

-- JOIN + ORDER BY
SELECT a.account_id, c.name, a.balance
FROM accounts a
JOIN customers c ON a.customer_id = c.customer_id
ORDER BY a.balance DESC;

-- WHERE
SELECT * FROM loans WHERE status = 'Approved';
```

Deposit and withdraw in the app use **MySQL transactions** so the balance update and the `transactions` insert succeed or fail together.

## Project structure

MVC layout: `routes` → `controllers` → `models` → MySQL.
