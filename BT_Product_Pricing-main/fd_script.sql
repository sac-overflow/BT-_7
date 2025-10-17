-- ========================
-- DATABASE: FD_Product_Pricing
-- ========================
CREATE DATABASE IF NOT EXISTS FD_Product_Pricing;
USE FD_Product_Pricing;

-- ========================
-- TABLE: PRODUCTS
-- ========================
CREATE TABLE products (
    product_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_code    VARCHAR(50) UNIQUE NOT NULL,
    product_name    VARCHAR(100) NOT NULL,
    product_type    VARCHAR(50) NOT NULL,
    effective_date  DATE NOT NULL,
    expiry_date     DATE,
    branch          VARCHAR(50),
    currency        VARCHAR(10),
    status          VARCHAR(20),
    description     TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================
-- TABLE: BUSINESS_RULES
-- ========================
CREATE TABLE business_rules (
    rule_id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id      BIGINT NOT NULL,
    min_term        INT,
    max_term        INT,
    min_amount      DECIMAL(15,2),
    max_amount      DECIMAL(15,2),
    interest_rate   DECIMAL(5,2),
    compounding_frequency VARCHAR(50),
    premature_withdrawal_allowed BOOLEAN,
    premature_penalty_rate DECIMAL(5,2),
    auto_renewal    BOOLEAN,
    min_balance_required DECIMAL(15,2),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_business_rules_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- ========================
-- TABLE: ROLES
-- ========================
CREATE TABLE roles (
    role_id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id      BIGINT NOT NULL,
    role_name       VARCHAR(50) NOT NULL,
    role_description VARCHAR(255),
    is_mandatory    BOOLEAN DEFAULT FALSE,
    max_count       INT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_roles_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- ========================
-- TABLE: BALANCES
-- ========================
CREATE TABLE balances (
    balance_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id      BIGINT NOT NULL,
    balance_type    VARCHAR(50) NOT NULL,
    balance_description VARCHAR(255),
    is_primary      BOOLEAN DEFAULT FALSE,
    calculation_method VARCHAR(50),
    min_balance_threshold DECIMAL(15,2),
    max_balance_limit DECIMAL(15,2),
    affect_interest_calculation BOOLEAN,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_balances_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- ========================
-- TABLE: TRANSACTION_TYPES
-- ========================
CREATE TABLE transaction_types (
    txn_type_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id      BIGINT NOT NULL,
    balance_id      BIGINT,
    txn_name        VARCHAR(50) NOT NULL,
    txn_description VARCHAR(255),
    is_debit        BOOLEAN,
    is_allowed      BOOLEAN,
    min_amount      DECIMAL(15,2),
    max_amount      DECIMAL(15,2),
    daily_limit     DECIMAL(15,2),
    frequency_limit_per_day INT,
    requires_min_balance_check BOOLEAN,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_txn_product FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT fk_txn_balance FOREIGN KEY (balance_id) REFERENCES balances(balance_id)
);

-- ========================
-- TABLE: CHARGES
-- ========================
CREATE TABLE charges (
    charge_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id      BIGINT NOT NULL,
    balance_id      BIGINT,
    txn_type_id     BIGINT,
    charge_type     VARCHAR(50),
    charge_name     VARCHAR(100),
    rate            DECIMAL(8,2),
    calculation_type VARCHAR(50),
    frequency       VARCHAR(50),
    is_mandatory    BOOLEAN,
    threshold_amount DECIMAL(15,2),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_charges_product FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT fk_charges_balance FOREIGN KEY (balance_id) REFERENCES balances(balance_id),
    CONSTRAINT fk_charges_txn FOREIGN KEY (txn_type_id) REFERENCES transaction_types(txn_type_id)
);

-- ========================
-- TABLE: TRANSACTIONAL_BALANCE_RULES
-- ========================
CREATE TABLE transactional_balance_rules (
    rule_id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    txn_type_id     BIGINT NOT NULL,
    balance_id      BIGINT NOT NULL,
    min_balance_after_txn DECIMAL(15,2),
    max_withdrawal_percentage DECIMAL(5,2),
    check_before_transaction BOOLEAN,
    validation_rule VARCHAR(255),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tbr_txn FOREIGN KEY (txn_type_id) REFERENCES transaction_types(txn_type_id),
    CONSTRAINT fk_tbr_balance FOREIGN KEY (balance_id) REFERENCES balances(balance_id)
);

-- ========================
-- TABLE: CHARGE_BALANCE_MAPPING
-- ========================
CREATE TABLE charge_balance_mapping (
    mapping_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    charge_id       BIGINT NOT NULL,
    balance_id      BIGINT NOT NULL,
    txn_type_id     BIGINT,
    application_rule VARCHAR(255),
    balance_threshold DECIMAL(15,2),
    is_active       BOOLEAN,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cbm_charge FOREIGN KEY (charge_id) REFERENCES charges(charge_id),
    CONSTRAINT fk_cbm_balance FOREIGN KEY (balance_id) REFERENCES balances(balance_id),
    CONSTRAINT fk_cbm_txn FOREIGN KEY (txn_type_id) REFERENCES transaction_types(txn_type_id)
);

-- ========================
-- TABLE: AUDITS
-- ========================
CREATE TABLE audits (
    audit_id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id      BIGINT,
    affected_entity_id BIGINT,
    entity_type     VARCHAR(50),
    operation       VARCHAR(50),
    old_values      TEXT,
    new_values      TEXT,
    created_by      VARCHAR(50),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address      VARCHAR(50),
    remarks         TEXT,
    CONSTRAINT fk_audits_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- ========================
-- STEP 1: DROP OLD AUDIT TABLE
-- ========================
DROP TABLE IF EXISTS audits;

-- ========================
-- STEP 2: REMOVE AUDIT COLUMNS FROM BUSINESS TABLES
-- ========================

-- PRODUCTS
ALTER TABLE products
    DROP COLUMN created_at,
    DROP COLUMN updated_at;

-- BUSINESS_RULES
ALTER TABLE business_rules
    DROP COLUMN created_at,
    DROP COLUMN updated_at;

-- ROLES
ALTER TABLE roles
    DROP COLUMN created_at,
    DROP COLUMN updated_at;

-- BALANCES
ALTER TABLE balances
    DROP COLUMN created_at,
    DROP COLUMN updated_at;

-- TRANSACTION_TYPES
ALTER TABLE transaction_types
    DROP COLUMN created_at,
    DROP COLUMN updated_at;

-- CHARGES
ALTER TABLE charges
    DROP COLUMN created_at,
    DROP COLUMN updated_at;

-- TRANSACTIONAL_BALANCE_RULES
ALTER TABLE transactional_balance_rules
    DROP COLUMN created_at,
    DROP COLUMN updated_at;

-- CHARGE_BALANCE_MAPPING
ALTER TABLE charge_balance_mapping
    DROP COLUMN created_at;

-- ========================
-- STEP 3: CREATE NEW CENTRALIZED AUDITS TABLE
-- ========================
CREATE TABLE audits (
    audit_id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_name     VARCHAR(100) NOT NULL,  -- e.g. "products", "charges"
    entity_id       BIGINT NOT NULL,        -- the row being changed
    operation       VARCHAR(50) NOT NULL,   -- INSERT, UPDATE, DELETE
    old_values      TEXT,
    new_values      TEXT,
    changed_by      VARCHAR(50),
    changed_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address      VARCHAR(50),
    remarks         TEXT
);

CREATE TABLE rate_matrix (
    rate_id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id       BIGINT NOT NULL,
    customer_category VARCHAR(50) NOT NULL,   -- e.g., Regular, Senior Citizen, NRI
    min_term         INT NOT NULL,            -- in days
    max_term         INT NOT NULL,            -- in days
    interest_rate    DECIMAL(5,2) NOT NULL,  -- interest rate in %
    rate_cap         DECIMAL(5,2),           -- optional cap if combination applies
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_rate_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Sample Products with varied dates
INSERT INTO products 
(product_code, product_name, product_type, effective_date, branch, currency, status, description)
VALUES
('FD001', 'SmartSaver FD', 'Fixed Deposit', '2025-10-01', 'Main Branch', 'INR', 'Active', 'Standard FD for general customers'),
('FD002', 'GoldenYears FD', 'Fixed Deposit', '2025-09-15', 'Main Branch', 'INR', 'Active', 'Special FD scheme for senior citizens with higher interest rates'),
('FD003', 'TaxShield FD', 'Fixed Deposit', '2025-08-20', 'Main Branch', 'INR', 'Active', 'Tax-saving FD with 5-year lock-in under Section 80C'),
('FD004', 'FlexiGain FD', 'Fixed Deposit', '2025-07-05', 'Main Branch', 'INR', 'Active', 'Flexi deposit linked with savings/current account balance'),
('FD005', 'StepUp FD', 'Fixed Deposit', '2025-06-10', 'Main Branch', 'INR', 'Active', 'Recurring deposit that converts into lump-sum FD at maturity'),
('FD006', 'GlobalConnect FD', 'Fixed Deposit', '2025-05-01', 'Main Branch', 'USD', 'Active', 'NRI FD product with repatriation benefits');

INSERT INTO roles (product_id, role_name, role_description, is_mandatory, max_count)
VALUES
-- SmartSaver FD (product_id = 1)
(1, 'Owner', 'Primary account holder of the FD', TRUE, 1),
(1, 'Co-Owner', 'Joint holder of the FD', FALSE, 3),
(1, 'Nominee', 'Person nominated to receive FD proceeds', FALSE, 1),

-- GoldenYears FD (product_id = 2)
(2, 'Owner', 'Senior citizen account holder of the FD', TRUE, 1),
(2, 'Co-Owner', 'Joint holder of the FD (can also be spouse)', FALSE, 1),
(2, 'Nominee', 'Person nominated to receive FD proceeds', FALSE, 1),

-- TaxShield FD (product_id = 3)
(3, 'Owner', 'Primary account holder availing tax benefits', TRUE, 1),
(3, 'Co-Owner', 'Joint holder (if applicable)', FALSE, 1),
(3, 'Nominee', 'Person nominated to receive FD proceeds', FALSE, 1),

-- FlexiGain FD (product_id = 4)
(4, 'Owner', 'Primary holder of the linked savings account', TRUE, 1),
(4, 'Co-Owner', 'Joint holder of the FD', FALSE, 2),
(4, 'Nominee', 'Person nominated to receive FD proceeds', FALSE, 1),

-- StepUp FD (product_id = 5)
(5, 'Owner', 'Primary account holder contributing monthly installments', TRUE, 1),
(5, 'Guardian', 'Guardian in case of minor holder', FALSE, 1),
(5, 'Nominee', 'Person nominated to receive FD proceeds', FALSE, 1),

-- GlobalConnect FD (product_id = 6)
(6, 'Owner', 'NRI account holder of the FD', TRUE, 1),
(6, 'Co-Owner', 'Joint NRI holder of the FD', FALSE, 1),
(6, 'Nominee', 'Person nominated to receive FD proceeds', FALSE, 1);

INSERT INTO business_rules 
(product_id, min_term, max_term, min_amount, max_amount, interest_rate, compounding_frequency, premature_withdrawal_allowed, premature_penalty_rate, auto_renewal, min_balance_required)
VALUES
-- SmartSaver FD (product_id = 1)
(1, 7, 3650, 5000.00, 10000000.00, 6.50, 'Quarterly', TRUE, 1.00, TRUE, 0.00),

-- GoldenYears FD (product_id = 2)
(2, 180, 3650, 10000.00, 5000000.00, 7.25, 'Quarterly', TRUE, 0.50, TRUE, 0.00),

-- TaxShield FD (product_id = 3)
(3, 1825, 1825, 1000.00, 150000.00, 6.75, 'Annual', FALSE, 0.00, FALSE, 0.00),

-- FlexiGain FD (product_id = 4)
(4, 30, 3650, 10000.00, 2000000.00, 6.25, 'Quarterly', TRUE, 1.00, TRUE, 25000.00),

-- StepUp FD (product_id = 5)
(5, 180, 3650, 500.00, 1000000.00, 6.40, 'Quarterly', TRUE, 1.00, TRUE, 0.00),

-- GlobalConnect FD (product_id = 6)
(6, 365, 3650, 500.00, 1000000.00, 5.80, 'Half-Yearly', TRUE, 1.50, TRUE, 0.00);


INSERT INTO transaction_types 
(product_id, balance_id, txn_name, txn_description, is_debit, is_allowed, min_amount, max_amount, daily_limit, frequency_limit_per_day, requires_min_balance_check)
VALUES
-- SmartSaver FD (1)
(1, NULL, 'Deposit', 'Initial deposit for FD', FALSE, TRUE, 5000.00, 10000000.00, 10000000.00, 1, TRUE),
(1, NULL, 'Withdrawal', 'Withdrawal on maturity', TRUE, TRUE, 5000.00, 10000000.00, 10000000.00, 1, FALSE),
(1, NULL, 'Premature Withdrawal', 'Withdrawal before maturity with penalty', TRUE, TRUE, 5000.00, 10000000.00, 1, 1, FALSE),
(1, NULL, 'Interest Accrual', 'Quarterly interest credit', FALSE, TRUE, 0.00, 10000000.00, 10000000.00, 4, FALSE),

-- GoldenYears FD (2)
(2, NULL, 'Deposit', 'Initial deposit for senior citizen FD', FALSE, TRUE, 10000.00, 5000000.00, 5000000.00, 1, TRUE),
(2, NULL, 'Withdrawal', 'Withdrawal on maturity', TRUE, TRUE, 10000.00, 5000000.00, 5000000.00, 1, FALSE),
(2, NULL, 'Premature Withdrawal', 'Early withdrawal with reduced penalty', TRUE, TRUE, 10000.00, 5000000.00, 1, 1, FALSE),
(2, NULL, 'Interest Accrual', 'Quarterly interest credit with bonus rate', FALSE, TRUE, 0.00, 5000000.00, 5000000.00, 4, FALSE),

-- TaxShield FD (3)
(3, NULL, 'Deposit', 'Initial deposit for tax-saving FD (lock-in 5 years)', FALSE, TRUE, 1000.00, 150000.00, 150000.00, 1, TRUE),
(3, NULL, 'Withdrawal', 'Withdrawal on maturity after lock-in period', TRUE, TRUE, 1000.00, 150000.00, 150000.00, 1, FALSE),
(3, NULL, 'Premature Withdrawal', 'Not allowed (lock-in period)', TRUE, FALSE, 0.00, 0.00, 0.00, 0, FALSE),
(3, NULL, 'Interest Accrual', 'Annual interest credit', FALSE, TRUE, 0.00, 150000.00, 150000.00, 1, FALSE),

-- FlexiGain FD (4)
(4, NULL, 'Deposit', 'Auto-sweep from savings account to FD', FALSE, TRUE, 10000.00, 2000000.00, 2000000.00, 10, TRUE),
(4, NULL, 'Withdrawal', 'Sweep-out to savings account on demand', TRUE, TRUE, 10000.00, 2000000.00, 2000000.00, 10, TRUE),
(4, NULL, 'Premature Withdrawal', 'Partial break allowed with penalty', TRUE, TRUE, 10000.00, 2000000.00, 2000000.00, 10, TRUE),
(4, NULL, 'Interest Accrual', 'Quarterly interest credit', FALSE, TRUE, 0.00, 2000000.00, 2000000.00, 4, FALSE),

-- StepUp FD (5)
(5, NULL, 'Deposit', 'Recurring monthly deposit into FD', FALSE, TRUE, 500.00, 1000000.00, 100000.00, 1, TRUE),
(5, NULL, 'Withdrawal', 'Withdrawal on maturity', TRUE, TRUE, 500.00, 1000000.00, 1000000.00, 1, FALSE),
(5, NULL, 'Premature Withdrawal', 'Closure allowed with penalty', TRUE, TRUE, 500.00, 1000000.00, 1, 1, FALSE),
(5, NULL, 'Interest Accrual', 'Quarterly interest credit', FALSE, TRUE, 0.00, 1000000.00, 1000000.00, 4, FALSE),

-- GlobalConnect FD (6)
(6, NULL, 'Deposit', 'Initial NRI deposit in foreign currency', FALSE, TRUE, 500.00, 1000000.00, 1000000.00, 1, TRUE),
(6, NULL, 'Withdrawal', 'Withdrawal on maturity with repatriation option', TRUE, TRUE, 500.00, 1000000.00, 1000000.00, 1, FALSE),
(6, NULL, 'Premature Withdrawal', 'Early withdrawal with higher penalty', TRUE, TRUE, 500.00, 1000000.00, 1, 1, FALSE),
(6, NULL, 'Interest Accrual', 'Half-yearly interest credit', FALSE, TRUE, 0.00, 1000000.00, 1000000.00, 2, FALSE),
(6, NULL, 'Currency Conversion', 'Conversion to INR or foreign currency', TRUE, TRUE, 0.00, 1000000.00, 1000000.00, 10, FALSE);

INSERT INTO charges 
(product_id, balance_id, txn_type_id, charge_type, charge_name, rate, calculation_type, frequency, is_mandatory, threshold_amount)
VALUES
-- SmartSaver FD (1)
(1, NULL, NULL, 'Penalty', 'Premature Withdrawal Penalty', 1.00, 'Percentage', 'On Withdrawal', TRUE, 0.00),
(1, NULL, NULL, 'Tax', 'TDS on Interest', 10.00, 'Percentage', 'Annual', TRUE, 40000.00),

-- GoldenYears FD (2)
(2, NULL, NULL, 'Penalty', 'Reduced Premature Withdrawal Penalty', 0.50, 'Percentage', 'On Withdrawal', TRUE, 0.00),
(2, NULL, NULL, 'Tax', 'TDS on Interest (Senior Citizen Threshold)', 10.00, 'Percentage', 'Annual', TRUE, 50000.00),

-- TaxShield FD (3)
(3, NULL, NULL, 'Fee', 'Lock-in Period Charge (No Premature Withdrawal Allowed)', 0.00, 'Flat', 'One-time', TRUE, 0.00),
(3, NULL, NULL, 'Tax', 'TDS on Interest', 10.00, 'Percentage', 'Annual', TRUE, 0.00),

-- FlexiGain FD (4)
(4, NULL, NULL, 'Penalty', 'Sweep-out Premature Charge', 1.00, 'Percentage', 'On Withdrawal', TRUE, 0.00),
(4, NULL, NULL, 'Tax', 'TDS on Interest', 10.00, 'Percentage', 'Annual', TRUE, 40000.00),

-- StepUp FD (5)
(5, NULL, NULL, 'Penalty', 'Premature Closure Penalty', 1.00, 'Percentage', 'On Withdrawal', TRUE, 0.00),
(5, NULL, NULL, 'Tax', 'TDS on Interest', 10.00, 'Percentage', 'Annual', TRUE, 40000.00),

-- GlobalConnect FD (6)
(6, NULL, NULL, 'Penalty', 'Premature Withdrawal Penalty', 1.50, 'Percentage', 'On Withdrawal', TRUE, 0.00),
(6, NULL, NULL, 'Fee', 'Currency Conversion Charge', 0.50, 'Percentage', 'On Deposit/Withdrawal', TRUE, 0.00);

-- SmartSaver FD (product_id = 1)
INSERT INTO rate_matrix (product_id, customer_category, min_term, max_term, interest_rate, rate_cap)
VALUES
(1, 'Regular', 7, 3650, 6.50, NULL),
(1, 'Senior Citizen', 7, 3650, 6.75, NULL),
(1, 'NRI', 7, 3650, 6.60, NULL);

-- GoldenYears FD (product_id = 2)
INSERT INTO rate_matrix (product_id, customer_category, min_term, max_term, interest_rate, rate_cap)
VALUES
-- SmartSaver FD (product_id = 1)
(1, 'Regular', 7, 3650, 6.50, NULL),
(1, 'Senior Citizen', 7, 3650, 6.75, NULL),
(1, 'NRI', 7, 3650, 6.60, NULL),

-- GoldenYears FD (product_id = 2)
(2, 'Regular', 180, 3650, 7.25, NULL),
(2, 'Senior Citizen', 180, 3650, 7.50, NULL),
(2, 'NRI', 180, 3650, 7.30, NULL),

-- TaxShield FD (product_id = 3)
(3, 'Regular', 1825, 1825, 6.75, NULL),
(3, 'Senior Citizen', 1825, 1825, 7.00, NULL),
(3, 'NRI', 1825, 1825, 6.85, NULL),

-- FlexiGain FD (product_id = 4)
(4, 'Regular', 30, 3650, 6.25, NULL),
(4, 'Senior Citizen', 30, 3650, 6.50, NULL),
(4, 'NRI', 30, 3650, 6.30, NULL),

-- StepUp FD (product_id = 5)
(5, 'Regular', 180, 3650, 6.40, NULL),
(5, 'Senior Citizen', 180, 3650, 6.60, NULL),
(5, 'NRI', 180, 3650, 6.45, NULL),

-- GlobalConnect FD (product_id = 6, USD product)
(6, 'Regular', 365, 3650, 5.80, NULL),
(6, 'Senior Citizen', 365, 3650, 6.00, NULL),
(6, 'NRI', 365, 3650, 5.90, NULL);

select * from transaction_types;

-- SmartSaver FD (product_id = 1)
UPDATE charges c
JOIN transaction_types t ON c.product_id = t.product_id
SET c.txn_type_id = t.txn_type_id
WHERE c.product_id = 1 AND c.charge_name = 'Premature Withdrawal Penalty' AND t.txn_name = 'Premature Withdrawal';

UPDATE charges c
JOIN transaction_types t ON c.product_id = t.product_id
SET c.txn_type_id = t.txn_type_id
WHERE c.product_id = 1 AND c.charge_name = 'TDS on Interest' AND t.txn_name = 'Interest Accrual';


-- GoldenYears FD (product_id = 2)
UPDATE charges c
JOIN transaction_types t ON c.product_id = t.product_id
SET c.txn_type_id = t.txn_type_id
WHERE c.product_id = 2 AND c.charge_name = 'Reduced Premature Withdrawal Penalty' AND t.txn_name = 'Premature Withdrawal';

UPDATE charges c
JOIN transaction_types t ON c.product_id = t.product_id
SET c.txn_type_id = t.txn_type_id
WHERE c.product_id = 2 AND c.charge_name LIKE 'TDS%' AND t.txn_name = 'Interest Accrual';


-- TaxShield FD (product_id = 3)
UPDATE charges c
JOIN transaction_types t ON c.product_id = t.product_id
SET c.txn_type_id = t.txn_type_id
WHERE c.product_id = 3 AND c.charge_name LIKE 'TDS%' AND t.txn_name = 'Interest Accrual';


-- FlexiGain FD (product_id = 4)
UPDATE charges c
JOIN transaction_types t ON c.product_id = t.product_id
SET c.txn_type_id = t.txn_type_id
WHERE c.product_id = 4 AND c.charge_name = 'Sweep-out Premature Charge' AND t.txn_name = 'Premature Withdrawal';

UPDATE charges c
JOIN transaction_types t ON c.product_id = t.product_id
SET c.txn_type_id = t.txn_type_id
WHERE c.product_id = 4 AND c.charge_name LIKE 'TDS%' AND t.txn_name = 'Interest Accrual';


-- StepUp FD (product_id = 5)
UPDATE charges c
JOIN transaction_types t ON c.product_id = t.product_id
SET c.txn_type_id = t.txn_type_id
WHERE c.product_id = 5 AND c.charge_name = 'Premature Closure Penalty' AND t.txn_name = 'Premature Withdrawal';

UPDATE charges c
JOIN transaction_types t ON c.product_id = t.product_id
SET c.txn_type_id = t.txn_type_id
WHERE c.product_id = 5 AND c.charge_name LIKE 'TDS%' AND t.txn_name = 'Interest Accrual';


-- GlobalConnect FD (product_id = 6)
UPDATE charges c
JOIN transaction_types t ON c.product_id = t.product_id
SET c.txn_type_id = t.txn_type_id
WHERE c.product_id = 6 AND c.charge_name = 'Premature Withdrawal Penalty' AND t.txn_name = 'Premature Withdrawal';

UPDATE charges c
JOIN transaction_types t ON c.product_id = t.product_id
SET c.txn_type_id = t.txn_type_id
WHERE c.product_id = 6 AND c.charge_name = 'Currency Conversion Charge' AND t.txn_name = 'Currency Conversion';

SELECT c.charge_id, p.product_name, c.charge_name, t.txn_name
FROM charges c
JOIN products p ON c.product_id = p.product_id
LEFT JOIN transaction_types t ON c.txn_type_id = t.txn_type_id
ORDER BY c.product_id, c.charge_id;

select * from products;
