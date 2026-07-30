# Personal Data Flow Audit

## Data Collection Points

| Data | Entry point | Stored in | External destination |
| --- | --- | --- | --- |
| Customer name, email, phone, address, password | Profile signup form -> `POST /api/customer/auth` | `customers`; password as bcrypt hash only | SMTP receives name/email for verification and welcome email |
| Login email and password | Profile login form -> `POST /api/customer/auth` | Password is not stored again; compared with bcrypt hash | None |
| Password reset email, OTP, new password | Forgot password flow -> `POST /api/customer/otp` and `POST /api/customer/auth` | `otps`; new password as bcrypt hash only | SMTP receives email/name and OTP |
| Checkout name, email, phone, address, receipt slip | Checkout/cart forms -> `POST /api/orders`; optional `POST /api/upload` | `orders`; receipt stored as `paymentSlipUrl` for admin verification | SMTP receives order confirmation/status data when customer email exists |
| Contact name, email, phone, message | Contact forms -> `POST /api/contact` | Not persisted by this app | SMTP sends inquiry to business inbox |
| Newsletter email | Newsletter form -> `POST /api/newsletter` | `newsletter_subscribers` | SMTP sends welcome/coupon email |
| Admin/staff email, name, password | Admin login/staff creation -> `/api/auth/login`, `/api/admins` | `users`; password as bcrypt hash only | None |
| IP address | Rate-limited API routes via `x-forwarded-for` | In-memory rate-limit maps only | None |
| Cart and wishlist product data | Cart/wishlist UI | `localStorage` product/cart IDs and product snapshots | None |
| PWA install dismissal flag | PWA install banner | `localStorage` boolean flag only | None |

## Third-Party Data Sharing

- MongoDB stores customer, order, staff, OTP, coupon, settings, newsletter, and log records.
- SMTP receives email content needed for verification, password reset, order notifications, contact inquiries, and newsletter welcome messages.
- Pusher receives only minimal event notifications after this audit: order ID/status for order events, product catalog changes, and a boolean customer registration signal. Customer email, phone, address, and full order payloads are not sent through Pusher.

## Cookie And Storage Notes

- Admin session cookie: `naeemi_session`, `httpOnly`, `sameSite: strict`, `secure` in production. JWT payload now contains only `userId`.
- Customer session cookie: `naeemi_customer_session`, `httpOnly`, `sameSite: strict`, `secure` in production. JWT payload now contains only `customerId`.
- No passwords, tokens, email addresses, phone numbers, or addresses are intentionally stored in `localStorage`.

## Deletion Flow

Customers can delete their account from the profile page. The API deletes the customer record, deletes OTP and newsletter records for that email, clears the customer cookie, and anonymizes order PII while preserving accounting/order history.

## Fixes Applied

- Removed PII from Pusher `new-order` and `customer-registered` events.
- Changed realtime admin refresh to fetch PII only through authorized APIs.
- Reduced JWT cookie payloads to IDs only.
- Redacted PII from logs and server API log responses.
- Removed OTP values from email subject lines.
- Redacted email recipient output from SMTP mock/success logs.
- Added field-level projections for staff, customers, and customer order responses.
- Extended account deletion to remove/anonymize related personal data.
