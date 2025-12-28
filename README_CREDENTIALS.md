# Quick Start: Setting Up Your Mastercard API Credentials

## You're seeing an error because credentials aren't configured yet!

The error `"Unexpected token '<', "<?xml vers"..."` means you need to add your actual Mastercard API credentials.

## Steps to Fix:

### 1. Get Your Credentials

Visit **[https://developer.mastercard.com/](https://developer.mastercard.com/)** and:
- Sign up for a free developer account
- Create a new app for "Open Banking (US)"
- Copy your credentials:
  - Partner ID
  - Partner Secret
  - App Key (also called Finicity-App-Key)

### 2. Add Credentials to Your Project

Open the `.env.local` file in the root of your project and replace the placeholder values:

```bash
# Replace these placeholder values with your actual credentials:
MASTERCARD_PARTNER_ID=1234567890
MASTERCARD_PARTNER_SECRET=abc123def456ghi789
MASTERCARD_APP_KEY=xyz789abc123def456
MASTERCARD_API_URL=https://api.finicity.com
```

**Important:**
- Remove `your_partner_id_here` and add your actual Partner ID
- Remove `your_partner_secret_here` and add your actual Partner Secret
- Remove `your_app_key_here` and add your actual App Key

### 3. Restart Your Server

```bash
# Stop your dev server (Ctrl+C)
# Then restart it:
npm run dev
```

### 4. Test It!

- Navigate to the "About You" section
- Search for a bank like "Chase" or "Wells Fargo"
- You should now see results!

## Still Having Issues?

Check `MASTERCARD_SETUP.md` for detailed troubleshooting steps.

### Common Issues:

**"No institutions found"** for "TD Bank"?
- Try searching just "TD" without "Bank"
- Or try "TD Bank, N.A."

**Still getting XML errors?**
- Double-check credentials are copied correctly (no extra spaces)
- Make sure you're using credentials from the Open Banking product
- Verify your app is active in the Mastercard Developer Portal

## Need Help?

- Full documentation: `MASTERCARD_SETUP.md`
- Mastercard Developer Portal: https://developer.mastercard.com/
- API Documentation: https://developer.mastercard.com/open-banking-us/documentation/
