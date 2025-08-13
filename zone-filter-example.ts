// Example hosted zone filtering configuration
// Copy this to your environment files and modify as needed

export const zoneFilterExample = {
  // Enable or disable zone filtering
  enabled: true,
  
  // Option 1: Exact zone names (recommended for production)
  allowedZones: [
    // Replace these with your actual zone names
    'myproduct.com',
    'api.myproduct.com',
    'internal.myproduct.com',
    'staging.myproduct.com',
    'test.myproduct.com'
  ],
  
  // Option 2: Zone patterns using wildcards (more flexible)
  allowedZonePatterns: [
    // Show all zones starting with 'prod-'
    'prod-*',
    
    // Show all zones ending with '.internal'
    '*.internal',
    
    // Show all zones starting with 'eu-'
    'eu-*',
    
    // Show all zones starting with 'us-'
    'us-*',
    
    // Show all zones containing 'staging'
    '*staging*',
    
    // Show all zones starting with 'test.'
    'test.*'
  ]
};

// Example configurations for different environments:

// Development Environment
export const devConfig = {
  enabled: true,
  allowedZones: [
    'dev.myproduct.com',
    'staging.myproduct.com',
    'test.myproduct.com'
  ],
  allowedZonePatterns: [
    'dev-*',
    'staging-*',
    'test-*'
  ]
};

// Production Environment
export const prodConfig = {
  enabled: true,
  allowedZones: [
    'myproduct.com',
    'api.myproduct.com',
    'www.myproduct.com'
  ],
  allowedZonePatterns: [
    'prod-*',
    'production.*'
  ]
};

// Internal/Private Environment
export const internalConfig = {
  enabled: true,
  allowedZones: [
    'internal.myproduct.com',
    'admin.myproduct.com',
    'corp.myproduct.com'
  ],
  allowedZonePatterns: [
    '*.internal',
    '*.corp',
    'admin.*'
  ]
};
