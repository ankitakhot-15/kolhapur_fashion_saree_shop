# Kolhapuri Fashion Saree — REST API Documentation (v1)

Base URL: `/api/v1`

## 1. Authentication & OTP
- `POST /auth/email-otp/send`
  - Body: `{ "email": "customer@example.com", "purpose": "LOGIN" }`
  - Description: Generates a cryptographically secure 6-digit OTP, valid for 5 minutes.
- `POST /auth/email-otp/verify`
  - Body: `{ "challengeId": "otp-...", "otp": "123456" }`
  - Returns: Session token and verified user role.
- `POST /auth/admin/login`
  - Body: `{ "username": "ankita_wavecode", "password": "..." }`
  - Returns: Admin authorization token.

## 2. Saree Catalog
- `GET /products`
  - Query params: `category`, `search`, `minPrice`, `maxPrice`, `fabric`, `occasion`, `sort`
  - Returns: List of active published sarees with color variants and stock.
- `GET /products/:slug`
  - Returns: Complete saree specifications, multiple gallery angles, and pallu zoom images.
- `GET /categories`
  - Returns: Circular categories (Paithani, Silk, Wedding, Traditional, etc.).
- `GET /banners`
  - Returns: Active hero carousel promotional slides.
- `GET /offers`
  - Returns: Active festive discounts.

## 3. Cart & Coupons
- `POST /coupons/validate`
  - Body: `{ "code": "FESTIVE10", "subtotalPaise": 500000 }`
  - Returns: `{ "valid": true, "discountPaise": 50000, "message": "..." }`

## 4. Checkout & Payments
- `POST /checkout/quote`
  - Body: `{ "items": [...], "couponCode": "FESTIVE10" }`
  - Returns: Authoritative server calculation of subtotal, tax (5%), shipping, and total payable amount.
- `POST /checkout/orders`
  - Body: `{ "customerName", "customerEmail", "customerPhone", "items", "shippingAddress", "couponCode" }`
  - Behavior: Reserves inventory stock transactionally and generates Razorpay order in paise.
- `POST /payments/razorpay/verify`
  - Body: `{ "orderId", "razorpayPaymentId", "razorpaySignature" }`
  - Behavior: Verifies payment signature, converts reserved stock to sold, and issues confirmed receipt.
- `POST /webhooks/razorpay`
  - Handles `payment.captured` with signature verification and idempotency.

## 5. Orders & Live Tracking
- `GET /orders/my?email=...`
  - Returns: Customer orders list.
- `GET /orders/:orderId`
  - Returns: Order snapshot, courier partner, tracking number, and status timeline.
- `POST /orders/:orderId/cancel`
  - Body: `{ "reason": "..." }`
  - Behavior: Eligible before shipment. Releases reserved handloom inventory immediately.

## 6. Admin Endpoints
- `GET /admin/dashboard`: Real-time KPI statistics.
- `POST /admin/products`: Saree creation and editing.
- `DELETE /admin/products/:id`: Saree deletion.
- `POST /admin/inventory/adjustments`: Stock restock/manual adjustment with audit reason.
- `PATCH /admin/orders/:orderId/status`: Status lifecycle transition.
- `PATCH /admin/orders/:orderId/shipment`: Assign Blue Dart / Delhivery tracking number.
- `POST /admin/orders/:orderId/refunds`: Process authorized refund.
- `GET /admin/audit-logs`: Administrative action logs.
- `PATCH /admin/settings`: Store announcements and shipping rules.
