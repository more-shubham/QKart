# Milestone: User & Authentication

## Overview
Implement a complete user authentication and profile management system with modern security practices.

## Issues (12 total)

### Backend - Authentication (4 issues)

#### Issue 1: JWT Authentication Setup
**Priority:** Critical | **Labels:** `backend`, `security`, `feature`

Implement JWT-based authentication system.

**Acceptance Criteria:**
- [ ] Add Spring Security dependency
- [ ] Create JWT utility class for token generation/validation
- [ ] Implement token refresh mechanism
- [ ] Set up security filter chain
- [ ] Configure CORS for frontend

**Technical Notes:**
- Use RS256 algorithm for JWT signing
- Token expiry: Access (15min), Refresh (7 days)
- Store refresh tokens in database with device info

---

#### Issue 2: User Registration API
**Priority:** Critical | **Labels:** `backend`, `feature`, `api`

Create user registration endpoint with validation.

**Acceptance Criteria:**
- [ ] POST /api/auth/register endpoint
- [ ] Email uniqueness validation
- [ ] Password strength validation (min 8 chars, uppercase, number, special)
- [ ] Password hashing with BCrypt
- [ ] Email verification token generation
- [ ] Return JWT tokens on successful registration

---

#### Issue 3: User Login API
**Priority:** Critical | **Labels:** `backend`, `feature`, `api`

Create secure login endpoint.

**Acceptance Criteria:**
- [ ] POST /api/auth/login endpoint
- [ ] Rate limiting (5 attempts per 15 minutes)
- [ ] Account lockout after failed attempts
- [ ] Return access and refresh tokens
- [ ] Record login history (IP, device, timestamp)

---

#### Issue 4: Password Reset Flow
**Priority:** High | **Labels:** `backend`, `feature`, `api`

Implement forgot password functionality.

**Acceptance Criteria:**
- [ ] POST /api/auth/forgot-password - send reset email
- [ ] POST /api/auth/reset-password - reset with token
- [ ] Token expiry (1 hour)
- [ ] Invalidate all sessions on password reset

---

### Frontend - Authentication (4 issues)

#### Issue 5: Login Page
**Priority:** Critical | **Labels:** `frontend`, `feature`, `ui`

Create login page with form validation.

**Acceptance Criteria:**
- [ ] Email and password inputs with validation
- [ ] "Remember me" checkbox
- [ ] "Forgot password" link
- [ ] Social login buttons (UI only)
- [ ] Error message display
- [ ] Loading state during submission
- [ ] Redirect to intended page after login

---

#### Issue 6: Registration Page
**Priority:** Critical | **Labels:** `frontend`, `feature`, `ui`

Create registration page.

**Acceptance Criteria:**
- [ ] Name, email, password, confirm password fields
- [ ] Real-time password strength indicator
- [ ] Terms and conditions checkbox
- [ ] Form validation with error messages
- [ ] Success message with email verification notice

---

#### Issue 7: Forgot Password Page
**Priority:** High | **Labels:** `frontend`, `feature`, `ui`

Create password reset flow UI.

**Acceptance Criteria:**
- [ ] Email input form
- [ ] Success message after submission
- [ ] Reset password form (with token from URL)
- [ ] Password strength indicator
- [ ] Redirect to login after successful reset

---

#### Issue 8: Auth Context & Protected Routes
**Priority:** Critical | **Labels:** `frontend`, `feature`

Implement authentication state management.

**Acceptance Criteria:**
- [ ] AuthContext with user state, login, logout, refresh
- [ ] Persist auth state in localStorage/cookies
- [ ] Auto-refresh tokens before expiry
- [ ] Protected route wrapper component
- [ ] Redirect unauthenticated users to login
- [ ] Redirect authenticated users from login/register pages

---

### User Profile (4 issues)

#### Issue 9: User Profile API
**Priority:** High | **Labels:** `backend`, `feature`, `api`

Create user profile management endpoints.

**Acceptance Criteria:**
- [ ] GET /api/users/me - get current user profile
- [ ] PUT /api/users/me - update profile
- [ ] PUT /api/users/me/password - change password
- [ ] DELETE /api/users/me - soft delete account
- [ ] Profile picture upload support

---

#### Issue 10: User Profile Page
**Priority:** High | **Labels:** `frontend`, `feature`, `ui`

Create user profile management page.

**Acceptance Criteria:**
- [ ] Display user information
- [ ] Edit profile form (name, phone)
- [ ] Profile picture upload with preview
- [ ] Change password section
- [ ] Delete account option with confirmation

---

#### Issue 11: Address Management
**Priority:** High | **Labels:** `frontend`, `backend`, `feature`

Enhanced address management for users.

**Acceptance Criteria:**
- [ ] List all addresses
- [ ] Add new address with validation
- [ ] Edit existing address
- [ ] Delete address
- [ ] Set default address
- [ ] Address autocomplete (Google Places API)

---

#### Issue 12: Order History Page
**Priority:** High | **Labels:** `frontend`, `feature`, `ui`

Display user's order history.

**Acceptance Criteria:**
- [ ] List all orders with pagination
- [ ] Order status badges (Pending, Processing, Shipped, Delivered)
- [ ] Order details modal/page
- [ ] Track order button
- [ ] Reorder functionality
- [ ] Download invoice PDF

---

## Dependencies
- Spring Security
- JWT library (jjwt)
- BCrypt
- Email service (for verification/reset)

## Database Changes
```sql
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN verification_token VARCHAR(255);
ALTER TABLE users ADD COLUMN profile_image_url VARCHAR(500);
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users ADD COLUMN created_at TIMESTAMP;
ALTER TABLE users ADD COLUMN updated_at TIMESTAMP;

CREATE TABLE refresh_tokens (
  id BIGINT PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  token VARCHAR(500),
  device_info VARCHAR(255),
  expires_at TIMESTAMP,
  created_at TIMESTAMP
);

CREATE TABLE login_history (
  id BIGINT PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  ip_address VARCHAR(50),
  user_agent VARCHAR(500),
  success BOOLEAN,
  created_at TIMESTAMP
);
```
