# Milestone: Orders & Payments

## Overview
Complete order management system with payment gateway integration and order tracking.

## Issues (14 total)

### Payment Integration (5 issues)

#### Issue 1: Stripe Payment Integration
**Priority:** Critical | **Labels:** `backend`, `frontend`, `feature`, `payment`

Integrate Stripe for payment processing.

**Acceptance Criteria:**
- [ ] Stripe SDK integration (backend)
- [ ] Create payment intent API
- [ ] Stripe Elements integration (frontend)
- [ ] Card payment support
- [ ] Payment confirmation handling
- [ ] Webhook for payment events
- [ ] Store payment details securely
- [ ] Handle payment failures gracefully

---

#### Issue 2: Multiple Payment Methods
**Priority:** High | **Labels:** `frontend`, `feature`, `payment`

Support various payment options.

**Acceptance Criteria:**
- [ ] Credit/Debit card (Stripe)
- [ ] UPI payment (Razorpay/PhonePe)
- [ ] Net Banking
- [ ] Wallet integration (Paytm, etc.)
- [ ] Cash on Delivery option
- [ ] Save payment methods for future use
- [ ] Payment method selection UI

---

#### Issue 3: Coupon & Discount System
**Priority:** High | **Labels:** `backend`, `frontend`, `feature`

Implement promotional codes and discounts.

**Acceptance Criteria:**
- [ ] Coupon code input at checkout
- [ ] Percentage and fixed amount discounts
- [ ] Minimum order value requirement
- [ ] Category-specific coupons
- [ ] First order discounts
- [ ] Usage limits (per user, total)
- [ ] Expiry dates
- [ ] Backend: Coupon CRUD and validation APIs

---

#### Issue 4: Price Breakdown Component
**Priority:** High | **Labels:** `frontend`, `feature`, `ui`

Detailed order summary display.

**Acceptance Criteria:**
- [ ] Subtotal calculation
- [ ] Discount amount display
- [ ] Tax calculation (GST)
- [ ] Shipping cost calculation
- [ ] Total amount
- [ ] Savings displayed prominently
- [ ] Estimated delivery date

---

#### Issue 5: Payment Security & PCI Compliance
**Priority:** Critical | **Labels:** `backend`, `security`

Ensure payment security standards.

**Acceptance Criteria:**
- [ ] No storage of full card numbers
- [ ] Use tokenization for saved cards
- [ ] HTTPS enforcement
- [ ] 3D Secure authentication
- [ ] Fraud detection integration
- [ ] Payment audit logging

---

### Order Management (5 issues)

#### Issue 6: Order Status System
**Priority:** Critical | **Labels:** `backend`, `feature`

Implement comprehensive order status tracking.

**Acceptance Criteria:**
- [ ] Order statuses: Placed, Confirmed, Processing, Shipped, Out for Delivery, Delivered, Cancelled, Returned
- [ ] Status update APIs
- [ ] Status history tracking
- [ ] Automatic status updates from shipping
- [ ] Status-based email notifications

---

#### Issue 7: Order Tracking Page
**Priority:** High | **Labels:** `frontend`, `feature`, `ui`

Visual order tracking interface.

**Acceptance Criteria:**
- [ ] Order timeline/progress visualization
- [ ] Current status highlight
- [ ] Estimated delivery date
- [ ] Shipping carrier information
- [ ] Tracking number with link
- [ ] Delivery address display
- [ ] Contact delivery partner button

---

#### Issue 8: Order Cancellation
**Priority:** High | **Labels:** `frontend`, `backend`, `feature`

Allow order cancellation.

**Acceptance Criteria:**
- [ ] Cancel button (before shipping)
- [ ] Cancellation reason selection
- [ ] Cancellation confirmation
- [ ] Automatic refund initiation
- [ ] Partial cancellation (for multi-item orders)
- [ ] Cancellation email notification

---

#### Issue 9: Returns & Refunds
**Priority:** High | **Labels:** `frontend`, `backend`, `feature`

Implement return and refund process.

**Acceptance Criteria:**
- [ ] Return request form
- [ ] Return reason selection
- [ ] Return pickup scheduling
- [ ] Return tracking
- [ ] Refund status tracking
- [ ] Refund to original payment method
- [ ] Exchange option
- [ ] Return policy display

---

#### Issue 10: Invoice Generation
**Priority:** Medium | **Labels:** `backend`, `feature`

Generate order invoices.

**Acceptance Criteria:**
- [ ] PDF invoice generation
- [ ] Company details, GST number
- [ ] Order details, items, prices
- [ ] Tax breakdown
- [ ] Download invoice button
- [ ] Email invoice attachment
- [ ] Invoice numbering system

---

### Checkout Enhancement (4 issues)

#### Issue 11: Guest Checkout
**Priority:** High | **Labels:** `frontend`, `backend`, `feature`

Allow checkout without registration.

**Acceptance Criteria:**
- [ ] Email-only checkout option
- [ ] Create account option at end
- [ ] Order lookup by email + order ID
- [ ] Convert guest to registered user

---

#### Issue 12: Checkout Optimization
**Priority:** High | **Labels:** `frontend`, `feature`, `ui`

Streamline checkout process.

**Acceptance Criteria:**
- [ ] Single-page checkout
- [ ] Progress indicator
- [ ] Auto-save cart
- [ ] Express checkout (saved info)
- [ ] Mobile-optimized checkout
- [ ] Reduce form fields (auto-fill from address)

---

#### Issue 13: Shipping Options
**Priority:** High | **Labels:** `frontend`, `backend`, `feature`

Multiple shipping methods.

**Acceptance Criteria:**
- [ ] Standard shipping (free above threshold)
- [ ] Express shipping (paid)
- [ ] Same-day delivery (where available)
- [ ] Scheduled delivery
- [ ] Pickup from store option
- [ ] Shipping cost calculation API

---

#### Issue 14: Cart Abandonment Recovery
**Priority:** Medium | **Labels:** `backend`, `feature`

Recover abandoned carts.

**Acceptance Criteria:**
- [ ] Track abandoned carts (items in cart, no order)
- [ ] Email reminder after 1 hour
- [ ] Include discount offer in reminder
- [ ] Restore cart from email link
- [ ] Analytics on recovery rate

---

## Dependencies
- Stripe SDK
- Razorpay SDK (for UPI)
- PDF generation library (iText/Apache PDFBox)
- Email service (SendGrid/SES)

## Database Changes
```sql
CREATE TABLE coupons (
  id BIGINT PRIMARY KEY,
  code VARCHAR(50) UNIQUE,
  discount_type ENUM('PERCENTAGE', 'FIXED'),
  discount_value DECIMAL(10,2),
  min_order_value DECIMAL(10,2),
  max_discount DECIMAL(10,2),
  usage_limit INT,
  used_count INT DEFAULT 0,
  per_user_limit INT DEFAULT 1,
  valid_from TIMESTAMP,
  valid_until TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE coupon_usage (
  id BIGINT PRIMARY KEY,
  coupon_id BIGINT REFERENCES coupons(id),
  user_id BIGINT REFERENCES users(id),
  order_id BIGINT REFERENCES orders(id),
  used_at TIMESTAMP
);

CREATE TABLE payments (
  id BIGINT PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id),
  payment_method VARCHAR(50),
  payment_provider VARCHAR(50),
  provider_payment_id VARCHAR(255),
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'INR',
  status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE order_status_history (
  id BIGINT PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id),
  status VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP
);

CREATE TABLE returns (
  id BIGINT PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id),
  reason VARCHAR(255),
  status ENUM('REQUESTED', 'APPROVED', 'PICKED_UP', 'RECEIVED', 'REFUNDED', 'REJECTED'),
  refund_amount DECIMAL(10,2),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```
