export const environment = {
  production: true,
  apiUrl: 'https://j125ycvo89.execute-api.eu-north-1.amazonaws.com/prod',
  // Hosted zone filtering configuration for production
  hostedZoneFilter: {
    enabled: true,
    // Only show these specific hosted zones in production
    allowedZones: [
      // Production zones only
      'mithitest123.com',
      'production.product2.com',
      'api.product3.com',
      // Add your actual production zone names here
    ],
    // Zone patterns for production
    allowedZonePatterns: [
      // Example: Only show production zones
      'prod-*',
      'production.*',
      // Example: Show zones for specific regions
      'eu-*',
      'us-*'
    ]
  }
};
