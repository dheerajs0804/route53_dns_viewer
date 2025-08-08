# Route 53 DNS Viewer

A modern Angular web application that integrates with AWS SDK to list DNS records from Route 53 hosted zones, filtered by a given prefix string.

## Features

- 🔐 **Secure Authentication**: AWS credentials-based authentication with support for temporary credentials
- 🌐 **Hosted Zone Selection**: Auto-populated dropdown of available Route 53 hosted zones
- 🔍 **Prefix Filtering**: Search DNS records by prefix with real-time filtering
- 📊 **Clean Table Display**: Material Design table showing Record Name, Type, TTL, and Values
- 📄 **Pagination**: Handle large numbers of DNS records efficiently
- 📥 **CSV Export**: Export filtered results to CSV format
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Loading States**: Spinners and progress indicators for better UX
- 🎨 **Modern UI**: Clean, professional interface using Angular Material

## Prerequisites

- Node.js (v20.16.0 or higher)
- npm or yarn
- AWS Account with Route 53 access
- IAM user with `AmazonRoute53ReadOnlyAccess` policy

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd route53-dns-viewer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

## AWS Setup

### Option 1: IAM User (Recommended for Development)

1. **Create an IAM User**
   - Go to AWS IAM Console
   - Create a new user or select existing user
   - Attach the `AmazonRoute53ReadOnlyAccess` policy

2. **Create Access Keys**
   - In the Security credentials tab, create access keys
   - Note down the Access Key ID and Secret Access Key

3. **Use in Application**
   - Enter the credentials in the login form
   - Select your preferred AWS region

### Option 2: Temporary Credentials (For Production)

1. **Use AWS STS**
   ```bash
   aws sts get-session-token
   ```

2. **Use in Application**
   - Enter the temporary credentials including the session token
   - These credentials expire after the specified duration

### Option 3: AWS Cognito (For Production)

For production applications, consider using AWS Cognito Identity Pools for secure, token-based authentication.

## Usage

1. **Login**
   - Enter your AWS credentials
   - Select your AWS region
   - Click "Login to AWS"

2. **Select Hosted Zone**
   - Choose from the dropdown of available hosted zones
   - The application will automatically load DNS records

3. **Filter Records**
   - Enter a prefix to filter records (e.g., "www", "api", "subdomain")
   - Leave empty to show all records
   - Results update automatically as you type

4. **View Results**
   - Records are displayed in a clean table format
   - Use pagination to navigate through large result sets
   - Click the export button to download results as CSV

5. **Additional Actions**
   - Use the menu button on each record for copy actions
   - Logout using the button in the top-right corner

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/
│   │   │   ├── login.component.ts
│   │   │   ├── login.component.html
│   │   │   └── login.component.scss
│   │   └── dns-viewer/
│   │       ├── dns-viewer.component.ts
│   │       ├── dns-viewer.component.html
│   │       └── dns-viewer.component.scss
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── aws-route53.service.ts
│   ├── models/
│   │   └── dns-record.interface.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── app.config.ts
├── styles.scss
└── main.ts
```

## Key Components

### Services
- **AuthService**: Manages authentication state and credentials
- **AwsRoute53Service**: Handles AWS Route 53 API calls using AWS SDK v3

### Components
- **LoginComponent**: AWS credentials input and authentication
- **DnsViewerComponent**: Main application interface for DNS record management

### Guards
- **AuthGuard**: Protects routes requiring authentication

## Technologies Used

- **Angular 19**: Latest stable version with standalone components
- **Angular Material**: UI components and theming
- **AWS SDK v3**: JavaScript SDK for AWS services
- **RxJS**: Reactive programming for state management
- **TypeScript**: Type-safe JavaScript development

## Security Considerations

⚠️ **Important**: This demo application stores AWS credentials in localStorage for convenience. For production use:

1. **Use AWS Cognito Identity Pools** for secure, token-based authentication
2. **Implement proper session management** with secure token storage
3. **Use HTTPS** in production environments
4. **Follow AWS security best practices** for credential management

## Development

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm test
```

### Lint Code
```bash
npm run lint
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure your AWS credentials have proper Route 53 permissions
   - Check that the selected region is correct

2. **No Hosted Zones Found**
   - Verify your AWS account has Route 53 hosted zones
   - Check that your credentials have `route53:ListHostedZones` permission

3. **Authentication Failures**
   - Verify your AWS credentials are correct
   - Ensure the selected region matches your hosted zones
   - For temporary credentials, include the session token

### Debug Mode

Enable debug logging by opening browser developer tools and checking the console for detailed error messages.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- Check the troubleshooting section above
- Review AWS Route 53 documentation
- Open an issue in the repository
