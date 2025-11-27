# Stripe Integration Temporarily Disabled

## Summary
Stripe payment integration has been temporarily removed from the Cars.na platform. All subscription functionality remains intact, but payments will be handled manually by the admin until a new payment provider (DPO) is integrated.

## Changes Made

### 1. **Removed Files**
- `src/lib/stripe.ts` - Stripe client initialization and helpers

### 2. **Modified Files**

#### `src/app/api/stripe/create-subscription/route.ts`
- ✅ Removed Stripe imports and API calls
- ✅ Subscription creation now works without payment processing
- ✅ Subscriptions are created with status `PENDING_PAYMENT`
- ✅ Admin must manually activate subscriptions after receiving payment

#### `src/app/api/stripe/webhook/route.ts`
- ✅ Removed Stripe webhook handling
- ✅ Returns placeholder response
- ✅ Ready to be updated when DPO is integrated
- ✅ Kept helper functions for future use

### 3. **Package Dependencies**
- Stripe package is still in `package.json` but not used
- Can be safely removed with: `npm uninstall stripe`

## How Subscriptions Work Now

### For Dealers:
1. **Registration**: Dealer registers and selects a subscription plan
2. **Approval**: Admin approves the dealership
3. **Payment**: Dealer contacts admin for payment details
4. **Activation**: Admin manually activates subscription after receiving payment

### For Admin:
1. View pending dealerships in admin panel
2. Receive payment through manual process (bank transfer, DPO, etc.)
3. Activate dealership subscription manually
4. Set subscription end date based on plan duration

## Subscription Status Flow

```
PENDING_PAYMENT → (Admin activates) → ACTIVE
```

All subscription features still work:
- ✅ Plan selection during registration
- ✅ Subscription plan limits (max listings, max photos)
- ✅ Subscription expiration tracking
- ✅ Subscription notifications
- ✅ Usage analytics

## Future Payment Provider Integration

When integrating DPO or another payment provider:

1. **Update these files:**
   - `src/app/api/stripe/create-subscription/route.ts`
   - `src/app/api/stripe/webhook/route.ts`

2. **Consider renaming the `/stripe` folder** to `/payment` or `/dpo`

3. **Add environment variables:**
   ```env
   DPO_API_KEY=your_key
   DPO_COMPANY_TOKEN=your_token
   DPO_WEBHOOK_SECRET=your_secret
   ```

4. **Implement webhook handling** for:
   - Payment success
   - Payment failure
   - Subscription updates

## Testing

To test the system without payments:

1. Register a new dealership
2. As admin, approve the dealership
3. Manually update subscription status in database:
   ```sql
   UPDATE "DealershipSubscription"
   SET status = 'ACTIVE'
   WHERE "dealershipId" = 'dealer-id-here';
   ```

## Startup Scripts

Use these scripts to run the application:

- **Development**: `start-dev.bat`
- **Production**: `build-and-start.bat`

Both scripts skip Stripe installation and work with the current setup.
