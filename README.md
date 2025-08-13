# Route 53 DNS Management Dashboard

A modern **Angular 17+** web application that provides secure, scalable DNS management through a **serverless backend** architecture. The application integrates with **AWS Route 53** via **AWS Lambda** and **API Gateway** to list and manage DNS records across multiple hosted zones with advanced filtering capabilities.

## 🚀 **Features**

- 🔐 **Secure Serverless Architecture**: **AWS Lambda** + **API Gateway** backend with **IAM role-based authentication**
- 🌐 **Advanced Zone Filtering**: Environment-based access control with **exact names** and **wildcard patterns**
- 🔍 **Multi-Zone Search**: Search DNS records across **all hosted zones** simultaneously or specific zones
- 📊 **Dynamic Table Display**: **Material Design** table with responsive columns and real-time data
- 🔍 **Prefix Filtering**: Search DNS records by prefix with **debounced real-time filtering**
- 📄 **Pagination**: Handle large numbers of DNS records efficiently
- 📥 **CSV Export**: Export filtered results to CSV format
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Loading States**: Spinners and progress indicators for enhanced UX
- 🎨 **Modern UI**: Clean, professional interface using **Angular Material** components
- 🛡️ **Security**: No AWS credentials stored in frontend - secure through Lambda execution roles

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Angular App   │───▶│   API Gateway    │───▶│   AWS Lambda    │
│   (Frontend)    │    │   (REST API)     │    │   (Backend)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   CORS Config    │    │   Route 53      │
                       │   (Security)     │    │   (DNS Service) │
                       └──────────────────┘    └─────────────────┘
```

## 📋 **Prerequisites**

- **Node.js** (v20.16.0 or higher)
- **npm** or **yarn**
- **AWS Account** with Route 53 access
- **AWS CLI** configured (for deployment)
- **IAM Role** with `AmazonRoute53ReadOnlyAccess` policy (for Lambda)

## 🚀 **Quick Start**

### 1. **Clone the Repository**
```bash
git clone <repository-url>
cd route53-dns-viewer
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Configure Environment**
Update `src/environments/environment.ts` with your API Gateway URL:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://your-api-gateway-url.amazonaws.com/prod',
  hostedZoneFilter: {
    enabled: true,
    allowedZones: ['yourdomain.com', '*.internal'],
    allowedZonePatterns: ['prod-*', 'eu-*']
  }
};
```

### 4. **Start Development Server**
```bash
npm start
```

### 5. **Open Browser**
Navigate to `http://localhost:4200`

## 🔧 **AWS Infrastructure Setup**

### **Lambda Functions**

The application requires three Lambda functions exposed through API Gateway:

#### **1. List Hosted Zones**
- **Endpoint**: `GET /zones`
- **Function**: Lists all Route 53 hosted zones
- **Permissions**: `route53:ListHostedZones`

#### **2. List DNS Records**
- **Endpoint**: `POST /records`
- **Function**: Retrieves DNS records with optional filtering
- **Parameters**: `hostedZoneId`, `prefix`, `allZones`
- **Permissions**: `route53:ListResourceRecordSets`

#### **3. Delete DNS Record**
- **Endpoint**: `POST /records/delete`
- **Function**: Deletes specified DNS records
- **Permissions**: `route53:ChangeResourceRecordSets`

### **API Gateway Configuration**

- **REST API** with CORS enabled
- **Lambda proxy integration** for each endpoint
- **API key** (optional) for additional security
- **Usage plans** for rate limiting

### **IAM Role for Lambda**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "route53:ListHostedZones",
        "route53:ListResourceRecordSets",
        "route53:ChangeResourceRecordSets"
      ],
      "Resource": "*"
    }
  ]
}
```

## 🎯 **Usage Guide**

### **1. Authentication**
- Simple login interface (no AWS credentials needed)
- Authentication handled through Lambda execution roles
- Secure access to Route 53 resources

### **2. Zone Selection & Filtering**
- **Single Zone**: Select specific hosted zone from dropdown
- **Multi-Zone**: Check "Search All Zones" to search across all visible zones
- **Zone Filtering**: Only zones matching environment configuration are visible

### **3. DNS Record Search**
- **Prefix Filtering**: Enter text to filter records (e.g., "www", "api")
- **Real-time Results**: Results update as you type with debouncing
- **Multi-zone Display**: Shows hosted zone name when searching across zones

### **4. Data Management**
- **View Records**: Clean table display with pagination
- **Export Data**: Download filtered results as CSV
- **Copy Actions**: Quick copy of record values

## 📁 **Project Structure**

```
src/
├── app/
│   ├── components/
│   │   ├── login/
│   │   │   ├── login.component.ts          # Simplified login
│   │   │   ├── login.component.html        # Basic login button
│   │   │   └── login.component.scss        # Login styles
│   │   └── dns-viewer/
│   │       ├── dns-viewer.component.ts     # Main DNS viewer logic
│   │       ├── dns-viewer.component.html   # Multi-zone interface
│   │       └── dns-viewer.component.scss   # Viewer styles
│   ├── services/
│   │   ├── auth.service.ts                 # Authentication state
│   │   ├── aws-route53.service.ts         # API Gateway integration
│   │   └── zone-filter.service.ts          # Zone filtering logic
│   ├── models/
│   │   └── dns-record.interface.ts         # Data interfaces
│   ├── guards/
│   │   └── auth.guard.ts                   # Route protection
│   ├── environments/
│   │   ├── environment.ts                  # Dev configuration
│   │   └── environment.prod.ts             # Prod configuration
│   ├── app.component.ts                    # Main app component
│   ├── app.routes.ts                       # Application routing
│   └── app.config.ts                       # App configuration
├── styles.scss                             # Global styles
└── main.ts                                 # Application entry point
```

## 🔑 **Key Components**

### **Services**
- **AuthService**: Manages authentication state and navigation
- **AwsRoute53Service**: HTTP client integration with API Gateway endpoints
- **ZoneFilterService**: Filters hosted zones based on environment configuration

### **Components**
- **LoginComponent**: Simple authentication interface
- **DnsViewerComponent**: Advanced DNS management with multi-zone support

### **Features**
- **Zone Filtering**: Environment-based access control
- **Multi-Zone Search**: Cross-zone DNS record discovery
- **Real-time Filtering**: Debounced search with instant results
- **Responsive Design**: Mobile-first Material Design interface

## 🛠️ **Technologies Used**

- **Frontend**: **Angular 17+** with standalone components
- **UI Framework**: **Angular Material** for modern design
- **Backend**: **AWS Lambda** with **Node.js 18.x**
- **API**: **AWS API Gateway** with REST endpoints
- **DNS Service**: **AWS Route 53**
- **State Management**: **RxJS** for reactive programming
- **Language**: **TypeScript** for type safety
- **Styling**: **SCSS** with Material Design theming

## 🔒 **Security Features**

✅ **No AWS Credentials in Frontend**
✅ **IAM Role-based Authentication**
✅ **CORS Configuration**
✅ **API Gateway Security**
✅ **Environment-based Access Control**
✅ **Zone Filtering for Multi-tenancy**

## 🚀 **Development Commands**

### **Build & Run**
```bash
# Development
npm start

# Production build
npm run build

# Preview production build
npm run preview
```

### **Code Quality**
```bash
# Lint code
npm run lint

# Run tests
npm test

# Check formatting
npm run format
```

## 🐛 **Troubleshooting**

### **Common Issues**

1. **CORS Errors**
   - Verify API Gateway CORS configuration
   - Check Lambda function response headers

2. **No Hosted Zones Found**
   - Verify Lambda execution role has Route 53 permissions
   - Check zone filtering configuration in environment files
   - Ensure zone names end with trailing dots (e.g., `domain.com.`)

3. **API Gateway Errors**
   - Check Lambda function logs in CloudWatch
   - Verify API endpoint URLs in environment configuration
   - Ensure Lambda functions are properly deployed

4. **Zone Filtering Issues**
   - Update environment configuration with correct zone names
   - Use trailing dots for zone names (e.g., `domain.com.`)
   - Check wildcard pattern syntax

### **Debug Mode**
Enable debug logging in browser developer tools console for detailed error messages and API request/response information.

## 📚 **Configuration Guide**

### **Zone Filtering Configuration**

The application supports flexible zone filtering through environment configuration:

```typescript
hostedZoneFilter: {
  enabled: true,
  allowedZones: [
    'product1.com.',           // Exact zone names (with trailing dot)
    'internal.product2.com.'   // Subdomain zones
  ],
  allowedZonePatterns: [
    'prod-*',                  // Wildcard patterns
    '*.internal',              // Suffix patterns
    'eu-*',                    // Prefix patterns
    'us-*'
  ]
}
```

### **Environment Variables**

- **Development**: `src/environments/environment.ts`
- **Production**: `src/environments/environment.prod.ts`
- **API URL**: Your API Gateway endpoint
- **Zone Filtering**: Access control configuration

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

For issues and questions:
- Check the troubleshooting section above
- Review [AWS Route 53 documentation](https://docs.aws.amazon.com/route53/)
- Open an issue in the repository
- Check Lambda function logs in AWS CloudWatch

## 🔮 **Future Enhancements**

- **DNS Record Creation/Editing**: Full CRUD operations
- **Bulk Operations**: Multi-record management
- **Advanced Filtering**: Regex and complex search patterns
- **Audit Logging**: Track DNS changes and access
- **Multi-region Support**: Route 53 across different AWS regions
- **Webhook Integration**: Real-time notifications for DNS changes

---

**Built with ❤️ using Angular, AWS Lambda, and modern web technologies**
