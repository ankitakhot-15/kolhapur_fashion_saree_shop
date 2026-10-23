# Firestore Database Schema & Data Models

## Collections Overview

### 1. `products`
```json
{
  "id": "saree-01",
  "name": "Shahi Royal Purple Peacock Paithani Silk Saree",
  "slug": "shahi-royal-purple-peacock-paithani-silk-saree",
  "sku": "KFS-PAITH-001",
  "description": "Authentic handwoven Paithani...",
  "categoryIds": ["cat-paithani", "cat-silk"],
  "categoryNames": ["Paithani Sarees", "Silk Sarees"],
  "fabric": "Pure Mulberry Silk",
  "occasion": "Weddings & Festive",
  "lengthMeters": 6.3,
  "blousePiece": "Running 0.8m unstitched pure silk blouse piece included",
  "careInstructions": "Dry clean only",
  "primaryImage": "/src/assets/images/...",
  "galleryImages": ["/src/assets/images/..."],
  "variants": [
    {
      "variantId": "var-01-purple",
      "colorName": "Royal Purple & Gold",
      "colorHex": "#4B0082",
      "sku": "KFS-PAITH-001-PUR",
      "originalPricePaise": 1899900,
      "sellingPricePaise": 1449900,
      "inventoryStock": 8,
      "reservedStock": 0,
      "images": [...]
    }
  ],
  "featured": true,
  "trending": true,
  "isNewArrival": true,
  "isPublished": true,
  "createdAt": "2026-10-21T...",
  "updatedAt": "2026-10-21T..."
}
```

### 2. `orders`
```json
{
  "id": "ord-1042",
  "orderNumber": "KFS-2026-1042",
  "userId": "pooja.kulkarni@example.com",
  "customerName": "Pooja Kulkarni",
  "customerEmail": "pooja.kulkarni@example.com",
  "customerPhone": "9822012345",
  "items": [
    {
      "productId": "saree-01",
      "variantId": "var-01-purple",
      "name": "Shahi Royal Purple Peacock Paithani Silk Saree",
      "colorName": "Royal Purple & Gold",
      "sku": "KFS-PAITH-001-PUR",
      "unitPricePaise": 1449900,
      "quantity": 1,
      "totalPaise": 1449900,
      "image": "...",
      "fabric": "Pure Mulberry Silk"
    }
  ],
  "shippingAddressSnapshot": {
    "fullName": "Pooja Kulkarni",
    "mobileNumber": "9822012345",
    "addressLine1": "Bunglow No. 12, Tarabai Park",
    "city": "Kolhapur",
    "state": "Maharashtra",
    "pinCode": "416003",
    "country": "India"
  },
  "subtotalPaise": 1449900,
  "couponDiscountPaise": 0,
  "shippingChargePaise": 0,
  "taxPaise": 72495,
  "finalPayablePaise": 1522395,
  "orderStatus": "Processing",
  "paymentStatus": "Paid",
  "paymentDetails": {
    "razorpayOrderId": "order_test_9876543210",
    "razorpayPaymentId": "pay_test_5432109876",
    "paidAt": "2026-10-21T...",
    "method": "Razorpay UPI"
  },
  "shipment": {
    "courierName": "Blue Dart Express",
    "trackingNumber": "BDKOL2026099182",
    "trackingUrl": "https://www.bluedart.com",
    "shippedAt": "2026-10-21T...",
    "estimatedDeliveryDate": "2026-10-25"
  },
  "statusHistory": [
    { "status": "Pending Payment", "timestamp": "...", "actor": "Customer" },
    { "status": "Order Confirmed", "timestamp": "...", "actor": "Gateway" }
  ],
  "createdAt": "...",
  "updatedAt": "..."
}
```

### 3. `inventoryMovements`
Tracks every restock, checkout reservation, order sale, and order cancellation stock release with timestamps and authorized actors.

### 4. `coupons`
Stores promotional discount codes with minimum order limits, percentage reductions, and usage limits.
