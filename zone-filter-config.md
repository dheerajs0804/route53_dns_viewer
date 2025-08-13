# Hosted Zone Filtering Configuration

This document explains how to configure which hosted zones are visible in the Route53 DNS Viewer application.

## Overview

The application now supports filtering hosted zones based on environment configuration. This allows you to:
- Show only specific hosted zones for certain products
- Hide sensitive internal zones
- Control zone visibility per environment (dev, staging, prod)

## Configuration Files

### Development Environment (`src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://j125ycvo89.execute-api.eu-north-1.amazonaws.com/prod',
  hostedZoneFilter: {
    enabled: true,
    // Only show these specific hosted zones
    allowedZones: [
      'product1.com',
      'product2.com',
      'internal.product3.com',
      // Add your actual zone names here
    ],
    // Zone patterns for flexible matching
    allowedZonePatterns: [
      'prod-*',        // All zones starting with 'prod-'
      '*.internal',    // All zones ending with '.internal'
      'eu-*',          // All zones starting with 'eu-'
      'us-*'           // All zones starting with 'us-'
    ]
  }
};
```

### Production Environment (`src/environments/environments.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://j125ycvo89.execute-api.eu-north-1.amazonaws.com/prod',
  hostedZoneFilter: {
    enabled: true,
    // Production zones only
    allowedZones: [
      'production.product1.com',
      'production.product2.com',
      'api.product3.com',
      // Add your actual production zone names here
    ],
    allowedZonePatterns: [
      'prod-*',
      'production.*',
      'eu-*',
      'us-*'
    ]
  }
};
```

## Configuration Options

### `enabled` (boolean)
- `true`: Enable zone filtering
- `false`: Show all hosted zones (default behavior)

### `allowedZones` (string[])
- Array of exact zone names or IDs to allow
- Examples: `'example.com'`, `'Z1234567890'`
- Case-insensitive matching

### `allowedZonePatterns` (string[])
- Array of patterns using wildcards
- `*` matches any sequence of characters
- `?` matches any single character
- Examples: `'prod-*'`, `'*.internal'`, `'eu-*'`

## Pattern Examples

| Pattern | Matches | Examples |
|---------|---------|----------|
| `prod-*` | Zones starting with "prod-" | `prod-web`, `prod-api`, `prod-db` |
| `*.internal` | Zones ending with ".internal" | `web.internal`, `api.internal` |
| `eu-*` | Zones starting with "eu-" | `eu-west`, `eu-central` |
| `*staging*` | Zones containing "staging" | `staging-web`, `web-staging` |
| `test.*` | Zones starting with "test." | `test.web`, `test.api` |

## What You Need to Do

### 1. Update Environment Files
Edit the environment files with your actual hosted zone names:

```typescript
// In src/environments/environment.ts (development)
allowedZones: [
  'your-product1.com',
  'your-product2.com',
  'internal.your-product3.com'
]

// In src/environments/environment.prod.ts (production)
allowedZones: [
  'production.your-product1.com',
  'production.your-product2.com',
  'api.your-product3.com'
]
```

### 2. Test the Configuration
1. Start the development server: `npm start`
2. Check the browser console for filtering logs
3. Verify only the specified zones are visible
4. Test pattern matching with your zone names

### 3. Deploy Changes
1. Build the application: `npm run build`
2. Deploy to your hosting environment
3. Verify filtering works in production

## Troubleshooting

### All Zones Are Hidden
- Check if `enabled` is set to `true`
- Verify zone names match exactly (including trailing dots)
- Check browser console for filtering logs

### Pattern Matching Not Working
- Ensure patterns use correct wildcard syntax
- Test patterns with your actual zone names
- Check for special characters that need escaping

### Zones Still Visible
- Verify the environment file is being used
- Check if filtering is enabled
- Restart the development server after changes

## Advanced Configuration

### Dynamic Filtering
You can update filters at runtime for testing:

```typescript
// In browser console or component
this.zoneFilterService.updateFilterConfig({
  allowedZones: ['new-zone.com'],
  allowedZonePatterns: ['new-*']
});
```

### Environment-Specific Patterns
Create different patterns for different environments:

```typescript
// Development: Show all test zones
allowedZonePatterns: ['test-*', 'dev-*', 'staging-*']

// Production: Show only production zones
allowedZonePatterns: ['prod-*', 'production.*']
```

## Security Considerations

- **Never commit sensitive zone names** to version control
- **Use environment variables** for production configurations
- **Regularly audit** which zones are visible
- **Monitor access logs** for unauthorized zone access attempts

## Support

If you encounter issues with zone filtering:
1. Check the browser console for error messages
2. Verify your zone names and patterns
3. Test with a simple configuration first
4. Check the application logs for debugging information
