export const environment = {
  production: false,
  apiUrl: 'https://j125ycvo89.execute-api.eu-north-1.amazonaws.com/prod',
  // Hosted zone filtering configuration
  hostedZoneFilter: {
    enabled: true,
    // Only show these specific hosted zones (by name or ID)
    allowedZones: [
      // Example: Only show zones for specific products
      'Z10289442HMQ36I85BABC',
      'mithi456.com.',
      // 'internal.product3.com',
      // You can also use zone IDs if needed
      // 'Z1234567890',
      // 'Z0987654321'
    ],
    // Alternative: Use zone ID patterns for more flexible matching
    allowedZonePatterns: [
      // Example: Show all zones that start with 'prod-'
      'prod-*',
      // Example: Show all zones that end with '.internal'
      '*.internal',
      // Example: Show zones for specific regions
      'eu-*',
      'us-*'
    ]
  }
};
