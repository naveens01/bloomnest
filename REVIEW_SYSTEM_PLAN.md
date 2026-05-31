# Review System Implementation Plan

## Overview
Implement a comprehensive review system where admins can add reviews for products, categories, and brands. Reviews will be displayed on respective detail pages with mobile-responsive design.

## Architecture

### 1. Database Schema (MongoDB)

```javascript
Review {
  _id: ObjectId,
  reviewType: String, // 'product', 'category', 'brand'
  targetId: ObjectId, // Reference to product/category/brand
  userName: String,
  userEmail: String (optional),
  rating: Number (1-5),
  comment: String,
  isVerified: Boolean,
  isApproved: Boolean,
  createdBy: ObjectId (admin user),
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Backend API Endpoints

**Admin Routes (Protected):**
- POST `/api/admin/reviews` - Create review
- GET `/api/admin/reviews` - List all reviews
- PUT `/api/admin/reviews/:id` - Update review
- DELETE `/api/admin/reviews/:id` - Delete review

**Public Routes:**
- GET `/api/products/:slug/reviews` - Get product reviews
- GET `/api/categories/:slug/reviews` - Get category reviews
- GET `/api/brands/:slug/reviews` - Get brand reviews

### 3. Frontend Components

**Admin Components:**
- `ReviewManagement.tsx` - Main admin review interface
- `ReviewForm.tsx` - Form to add/edit reviews
- `ReviewList.tsx` - List of all reviews with edit/delete

**Public Components:**
- `ReviewCard.tsx` - Single review display
- `ReviewSection.tsx` - Reviews section for detail pages
- `ReviewStats.tsx` - Rating summary and statistics

### 4. Features

**Admin Features:**
- Select review type (product/category/brand)
- Search and select target item
- Enter reviewer name
- Set rating (1-5 stars)
- Write review comment
- Mark as verified purchase
- Approve/unapprove reviews

**Public Features:**
- Display reviews on product/category/brand pages
- Show average rating
- Show rating distribution
- Sort reviews (newest, highest rated, lowest rated)
- Pagination for reviews
- Mobile-responsive design

## Implementation Steps

### Phase 1: Backend (Steps 1-2)
1. Create Review model
2. Add review API endpoints
3. Add review routes to admin.js

### Phase 2: Frontend Types & API (Step 3)
1. Add Review interface to types
2. Add review API calls to api.ts

### Phase 3: Admin UI (Step 4)
1. Create ReviewManagement component
2. Add to AdminPage tabs
3. Implement CRUD operations

### Phase 4: Public Display (Steps 5-6)
1. Create review display components
2. Add to ProductDetailPage
3. Add to CategoryPage
4. Add to BrandPage

### Phase 5: Polish (Steps 7-8)
1. Mobile responsive design
2. Testing
3. Commit and deploy

## UI Design

### Admin Review Form
```
┌─────────────────────────────────────┐
│ Add New Review                      │
├─────────────────────────────────────┤
│ Review Type: [Product ▼]            │
│ Select Product: [Search...      ▼] │
│ Reviewer Name: [____________]       │
│ Rating: ★★★★☆                       │
│ Comment:                            │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│ ☑ Verified Purchase                 │
│ ☑ Approved                          │
│                                     │
│ [Cancel] [Save Review]              │
└─────────────────────────────────────┘
```

### Public Review Display
```
┌─────────────────────────────────────┐
│ Customer Reviews                    │
│ ★★★★☆ 4.5 out of 5 (24 reviews)    │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ ★★★★★ John Doe                  │ │
│ │ Verified Purchase • 2 days ago  │ │
│ │ Great product! Highly recommend │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ★★★★☆ Jane Smith               │ │
│ │ 1 week ago                      │ │
│ │ Good quality, fast shipping     │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Mobile Responsive Design
- Stack review cards vertically
- Reduce padding and font sizes
- Touch-friendly star rating
- Collapsible review text for long comments
- Infinite scroll or pagination

## Success Criteria
- ✅ Admin can create reviews for any product/category/brand
- ✅ Reviews display on respective detail pages
- ✅ Mobile responsive on all screen sizes
- ✅ Rating statistics calculated correctly
- ✅ Reviews can be edited and deleted by admin
- ✅ Clean, professional UI matching site design