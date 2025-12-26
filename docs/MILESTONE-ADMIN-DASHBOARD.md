# Milestone: Admin Dashboard

## Overview
Complete admin panel for managing products, orders, users, and analytics.

## Issues (16 total)

### Admin Foundation (3 issues)

#### Issue 1: Admin Authentication & Roles
**Priority:** Critical | **Labels:** `backend`, `security`, `feature`

Role-based access control for admin.

**Acceptance Criteria:**
- [ ] Admin role in user system
- [ ] Super Admin, Admin, Manager roles
- [ ] Permission-based access (products, orders, users)
- [ ] Admin-only API endpoints
- [ ] Separate admin login portal
- [ ] Session management for admins
- [ ] Admin activity logging

---

#### Issue 2: Admin Layout & Navigation
**Priority:** Critical | **Labels:** `frontend`, `feature`, `ui`

Create admin dashboard layout.

**Acceptance Criteria:**
- [ ] Sidebar navigation
- [ ] Top bar with user info, notifications
- [ ] Responsive design (collapsible sidebar)
- [ ] Breadcrumb navigation
- [ ] Dark mode support
- [ ] Quick actions menu

---

#### Issue 3: Admin Dashboard Home
**Priority:** High | **Labels:** `frontend`, `feature`, `ui`

Main dashboard with key metrics.

**Acceptance Criteria:**
- [ ] Today's stats cards (orders, revenue, users)
- [ ] Sales chart (daily/weekly/monthly)
- [ ] Recent orders list
- [ ] Low stock alerts
- [ ] Top selling products
- [ ] Revenue by category pie chart

---

### Product Management (4 issues)

#### Issue 4: Product List (Admin)
**Priority:** Critical | **Labels:** `frontend`, `feature`, `ui`

Admin product listing page.

**Acceptance Criteria:**
- [ ] Data table with all products
- [ ] Search and filter
- [ ] Bulk actions (delete, update status)
- [ ] Sort by columns
- [ ] Pagination
- [ ] Quick edit inline
- [ ] Export to CSV/Excel

---

#### Issue 5: Product Create/Edit Form
**Priority:** Critical | **Labels:** `frontend`, `feature`, `ui`

Product management form.

**Acceptance Criteria:**
- [ ] Basic info (name, description, price)
- [ ] Category and subcategory selection
- [ ] Multiple image upload with drag-and-drop
- [ ] Image reordering
- [ ] Inventory management (stock, SKU)
- [ ] SEO fields (meta title, description)
- [ ] Product variants (size, color)
- [ ] Scheduled publish date
- [ ] Draft/Published status

---

#### Issue 6: Category Management
**Priority:** High | **Labels:** `frontend`, `backend`, `feature`

Manage product categories.

**Acceptance Criteria:**
- [ ] Category tree view
- [ ] Create/Edit/Delete categories
- [ ] Subcategory support (nested)
- [ ] Category image upload
- [ ] Category description
- [ ] Reorder categories (drag-and-drop)
- [ ] Backend: Category CRUD APIs

---

#### Issue 7: Inventory Management
**Priority:** High | **Labels:** `frontend`, `backend`, `feature`

Stock tracking and alerts.

**Acceptance Criteria:**
- [ ] Stock levels dashboard
- [ ] Low stock alerts (configurable threshold)
- [ ] Stock adjustment history
- [ ] Bulk stock update
- [ ] Inventory reports
- [ ] Auto-disable out of stock products

---

### Order Management (4 issues)

#### Issue 8: Order List (Admin)
**Priority:** Critical | **Labels:** `frontend`, `feature`, `ui`

Admin order listing.

**Acceptance Criteria:**
- [ ] All orders with status filter
- [ ] Date range filter
- [ ] Search by order ID, customer
- [ ] Bulk status update
- [ ] Quick view order details
- [ ] Print packing slip
- [ ] Export orders

---

#### Issue 9: Order Details (Admin)
**Priority:** Critical | **Labels:** `frontend`, `feature`, `ui`

Detailed order view for admin.

**Acceptance Criteria:**
- [ ] Order items with images
- [ ] Customer details
- [ ] Shipping address
- [ ] Payment information
- [ ] Order timeline
- [ ] Add internal notes
- [ ] Status update dropdown
- [ ] Refund/Cancel actions
- [ ] Print invoice

---

#### Issue 10: Shipping Management
**Priority:** High | **Labels:** `frontend`, `backend`, `feature`

Manage shipping and tracking.

**Acceptance Criteria:**
- [ ] Assign shipping carrier
- [ ] Add tracking number
- [ ] Generate shipping label
- [ ] Bulk shipping update
- [ ] Shipping carrier integration (Shiprocket, Delhivery)

---

#### Issue 11: Return Management
**Priority:** High | **Labels:** `frontend`, `feature`, `ui`

Handle returns from admin.

**Acceptance Criteria:**
- [ ] Return requests list
- [ ] Approve/Reject returns
- [ ] Process refunds
- [ ] Return reason analytics
- [ ] Communication with customer

---

### User & Analytics (5 issues)

#### Issue 12: User Management
**Priority:** High | **Labels:** `frontend`, `backend`, `feature`

Manage platform users.

**Acceptance Criteria:**
- [ ] User list with search/filter
- [ ] User details view (orders, addresses)
- [ ] Block/Unblock users
- [ ] Password reset for user
- [ ] User activity log
- [ ] Export user data

---

#### Issue 13: Customer Insights
**Priority:** Medium | **Labels:** `frontend`, `feature`

Customer analytics dashboard.

**Acceptance Criteria:**
- [ ] New vs returning customers
- [ ] Customer lifetime value
- [ ] Top customers by revenue
- [ ] Geographic distribution
- [ ] Customer acquisition trends

---

#### Issue 14: Sales Analytics
**Priority:** High | **Labels:** `frontend`, `feature`

Sales reporting dashboard.

**Acceptance Criteria:**
- [ ] Revenue charts (daily, weekly, monthly, yearly)
- [ ] Sales by category/product
- [ ] Average order value trends
- [ ] Conversion rate
- [ ] Cart abandonment rate
- [ ] Compare periods
- [ ] Export reports

---

#### Issue 15: Coupon Management
**Priority:** Medium | **Labels:** `frontend`, `backend`, `feature`

Manage promotional coupons.

**Acceptance Criteria:**
- [ ] Create/Edit/Delete coupons
- [ ] Coupon usage statistics
- [ ] Bulk coupon generation
- [ ] Coupon performance analytics
- [ ] Schedule coupon activation

---

#### Issue 16: Settings & Configuration
**Priority:** Medium | **Labels:** `frontend`, `backend`, `feature`

Platform settings management.

**Acceptance Criteria:**
- [ ] Store information (name, logo, contact)
- [ ] Tax settings (GST rates)
- [ ] Shipping settings
- [ ] Email templates customization
- [ ] Payment gateway settings
- [ ] Notification preferences

---

## Dependencies
- Admin UI library (Ant Design/Material UI)
- Chart library (Chart.js/Recharts)
- Data table library (TanStack Table)
- Rich text editor (TipTap/Slate)

## Database Changes
```sql
ALTER TABLE users ADD COLUMN role ENUM('CUSTOMER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN') DEFAULT 'CUSTOMER';

CREATE TABLE admin_activity_log (
  id BIGINT PRIMARY KEY,
  admin_id BIGINT REFERENCES users(id),
  action VARCHAR(100),
  entity_type VARCHAR(50),
  entity_id BIGINT,
  details JSON,
  ip_address VARCHAR(50),
  created_at TIMESTAMP
);

CREATE TABLE categories (
  id BIGINT PRIMARY KEY,
  name VARCHAR(100),
  slug VARCHAR(100) UNIQUE,
  parent_id BIGINT REFERENCES categories(id),
  description TEXT,
  image_url VARCHAR(500),
  sort_order INT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE store_settings (
  id BIGINT PRIMARY KEY,
  key VARCHAR(100) UNIQUE,
  value TEXT,
  updated_at TIMESTAMP
);

CREATE TABLE order_notes (
  id BIGINT PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id),
  admin_id BIGINT REFERENCES users(id),
  note TEXT,
  is_internal BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP
);
```
