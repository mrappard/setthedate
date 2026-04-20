# Set The Date

## Overview

Set The Date is a web platform for discovering events, purchasing access to them, and validating user identity. The site supports social login, user profile creation, event browsing, cart-based checkout with Stripe, and identity verification through uploaded ID images.

## Core User Flows

### 1. Authentication
The platform allows users to sign in using:
- Google
- Facebook
- LinkedIn

Users who do not already have an account will have one created automatically on first sign-in.

### 2. Profile Creation and Management
After login, users can create and manage a profile. The profile should support:
- Full name
- Profile photo
- Email address
- Phone number
- Short bio
- Location
- Saved payment and billing preferences
- Identity verification status

### 3. Event Discovery
Users can browse a list of available events. Event listings should include:
- Event title
- Description
- Date and time
- Venue or online location
- Price
- Capacity or availability
- Organizer information
- Event image or banner

The platform should support:
- Search
- Filtering by date, location, category, and price
- Viewing full event details

### 4. Cart and Access Purchase
Users can add paid events to a shopping cart before checkout.

Cart functionality should include:
- Add event to cart
- Remove event from cart
- Adjust quantities where relevant
- View subtotal and total
- Prevent duplicate purchases for the same user where appropriate

### 5. Payment Processing with Stripe
The platform uses Stripe for payment processing.

Checkout should support:
- Secure checkout session creation
- Payment confirmation
- Failed payment handling
- Receipt generation
- Post-purchase access provisioning
- Webhook handling for payment success, failure, and refund events

After successful payment:
- The user receives access to the purchased event
- The purchase is recorded in the user's account
- A confirmation email is sent

### 6. Identity Verification
Users can upload pictures of their government-issued ID to validate their identity.

Supported verification flow:
- Front of ID upload
- Back of ID upload where required
- Optional selfie capture or live photo for liveness matching
- Secure file storage
- Review and validation process
- Verification status displayed in the user profile

The system should clearly communicate the verification states:
- Not started
- Pending review
- Verified
- Rejected

## Functional Requirements

### Authentication Requirements
- OAuth login with Google, Facebook, and LinkedIn
- Session management
- Secure account linking when the same email is used across providers
- Logout support

### Profile Requirements
- Create and edit profile
- Persist profile data
- Show purchase history
- Show verification status

### Event Requirements
- Public event listing page
- Event detail page
- Access control for purchased events
- Organizer-managed event metadata

### Cart Requirements
- Persistent cart for logged-in users
- Price calculation
- Cart validation before checkout

### Payments Requirements
- Stripe Checkout or Payment Element integration
- Webhook verification
- Order and transaction records
- Refund support

### Identity Verification Requirements
- Secure upload of ID images
- Validation pipeline for uploaded images
- Admin review tooling or integration with a verification provider
- Audit log for verification decisions

## Non-Functional Requirements

### Security
- Use HTTPS everywhere
- Encrypt sensitive user data at rest and in transit
- Store uploaded identity documents securely
- Restrict access to identity documents and verification results
- Follow least-privilege access for admin tools

### Privacy and Compliance
- Provide consent language before ID upload
- Define data retention policy for identity documents
- Support account deletion workflow
- Comply with applicable privacy laws and payment requirements

### Performance
- Fast event browsing experience
- Optimized image uploads
- Reliable webhook processing
- Responsive UI for desktop and mobile

## Suggested Pages

- Home page
- Login / Sign up page
- Profile page
- Event listing page
- Event detail page
- Cart page
- Checkout page
- Purchase confirmation page
- Identity verification page
- Admin review dashboard

## Suggested Data Models

### User
- id
- email
- authProvider
- fullName
- profilePhotoUrl
- phone
- bio
- location
- verificationStatus
- createdAt
- updatedAt

### Event
- id
- title
- description
- imageUrl
- startDate
- endDate
- location
- organizerId
- price
- capacity
- status

### CartItem
- id
- userId
- eventId
- quantity
- unitPrice

### Order
- id
- userId
- totalAmount
- currency
- stripeSessionId
- paymentStatus
- createdAt

### PurchasedAccess
- id
- userId
- eventId
- orderId
- accessStatus

### IdentityVerification
- id
- userId
- frontIdImageUrl
- backIdImageUrl
- selfieImageUrl
- status
- reviewedBy
- reviewedAt
- rejectionReason

## Suggested Tech Integrations

- Frontend: Next.js
- Authentication: NextAuth or equivalent OAuth provider integration
- Database: PostgreSQL or equivalent
- File Storage: Secure object storage
- Payments: Stripe
- Identity Verification: Internal review flow or third-party verification provider

## MVP Scope

The first release should include:
- Social login
- Profile creation
- Event listing and detail pages
- Cart and Stripe checkout
- Basic access control for purchased events
- ID upload for identity verification
- Admin ability to review verification submissions

## Future Enhancements

- Event recommendations
- Waitlists
- Promo codes
- Ticket transfer
- QR code check-in
- Automated ID verification
- Fraud detection
- Multi-organizer support
