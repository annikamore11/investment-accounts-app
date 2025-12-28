# Mastercard Open Banking API Setup

This project uses the Mastercard Open Banking API (formerly Finicity) to verify bank institutions and check if they're supported for instant verification.

## Getting Your API Credentials

1. **Sign up for a Mastercard Developer Account**
   - Visit [https://developer.mastercard.com/](https://developer.mastercard.com/)
   - Create a free account

2. **Create an App**
   - Navigate to the Open Banking (US) product
   - Create a new app to get your credentials

3. **Get Your Credentials**
   You'll need three pieces of information:
   - **Partner ID**: Your unique partner identifier
   - **Partner Secret**: Your secret key for authentication
   - **App Key**: Your application key (also called Finicity-App-Key)

## Setting Up Environment Variables

1. **Copy the example file**
   ```bash
   cp .env.example .env.local
   ```

2. **Add your credentials to `.env.local`**
   ```
   MASTERCARD_PARTNER_ID=your_partner_id_here
   MASTERCARD_PARTNER_SECRET=your_partner_secret_here
   MASTERCARD_APP_KEY=your_app_key_here
   MASTERCARD_API_URL=https://api.finicity.com
   ```

   Replace `your_partner_id_here`, `your_partner_secret_here`, and `your_app_key_here` with your actual credentials.

## Testing the Integration

### Using the Test Sandbox

Mastercard provides a test sandbox for development:

1. The API URL is already set to the production endpoint (`https://api.finicity.com`)
2. For testing, you can search for "FinBank Profiles - A" as a test institution
3. Test institutions will return mock data for development

### Testing in Your App

1. Navigate to the "About You" section of the journey
2. Answer the questions about bank account ownership
3. When you reach the "Bank Institution" step:
   - Search for your bank (e.g., "Chase", "Bank of America")
   - Select from the results
   - The app will verify if it's supported

## API Endpoints Used

### Search Institutions
```
GET /institution/v2/institutions?search={query}&limit={limit}
```
- Searches for financial institutions by name
- Returns a list of matching institutions
- Non-billable, < 500ms response time

### Get Institution by ID
```
GET /institution/v2/institutions/{institutionId}
```
- Retrieves detailed information about a specific institution
- Returns institution configuration and capabilities

## Features Implemented

1. **Institution Search**
   - Real-time search as you type
   - Debounced API calls (500ms delay)
   - Displays institution name and website

2. **Support Verification**
   - Checks if the institution supports instant verification
   - Shows verification status (supported/limited support)
   - Provides alternative suggestions if needed

3. **Journey Integration**
   - Seamlessly integrated into the About You section
   - Saved to journey data for later use
   - Displayed in the summary view

## API Rate Limits

- Authentication tokens are cached per request
- Search endpoint is non-billable
- Response time is typically < 500ms

## Troubleshooting

### "Mastercard credentials not configured" error
- Check that your `.env.local` file exists
- Verify all three credentials are set
- Restart your development server after adding credentials

### "Authentication failed" error
- Verify your Partner ID and Partner Secret are correct
- Check that your App Key is valid
- Ensure you're using the correct API URL

### No search results
- Try different search terms
- Check if the institution name is spelled correctly
- Some smaller institutions may not be in the database

## Documentation

- [Mastercard Open Banking Documentation](https://developer.mastercard.com/open-banking-us/documentation/)
- [API Reference](https://developer.mastercard.com/open-finance-us/documentation/api-reference/)
- [GitHub - OpenAPI Specification](https://github.com/Mastercard/open-banking-us-openapi)
- [Supported Institutions](https://developer.mastercard.com/open-banking-us/documentation/financial-institution/supported-institutions/)

## Security Notes

- Never commit `.env.local` to version control (it's already in `.gitignore`)
- Keep your Partner Secret and App Key confidential
- Rotate credentials periodically
- Use environment-specific credentials for production

## Support

For issues with the Mastercard API:
- Visit [Mastercard Developer Portal](https://developer.mastercard.com/)
- Check the [API Status Page](https://developer.mastercard.com/api-status)
- Review the [OpenAPI specification](https://github.com/Mastercard/open-banking-us-openapi)
