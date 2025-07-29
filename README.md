# QR Code Visitor Check-In System

A professional Next.js application that provides a streamlined visitor management solution using QR codes and Zapier automation, built with shadcn/ui for modern design.

## 🚀 Features

- **QR Code Generation**: Create visitor QR codes with embedded meeting details
- **Camera Scanning**: Scan QR codes using device cameras for instant check-in
- **Zapier Automation**: Automatic email notifications and workflows via Zapier webhooks
- **Professional UI**: Modern, clean interface built with shadcn/ui components
- **Mobile Responsive**: Optimized for all device sizes and screen orientations
- **Real-time Validation**: Form validation and error handling throughout the flow
- **Two-Page System**: Simplified workflow - Create QR codes and Scan QR codes

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **QR Codes**: qrcode (generation) + html5-qrcode (scanning)
- **Automation**: Zapier webhooks for email notifications
- **TypeScript**: Full type safety throughout

## 📋 Prerequisites

- Node.js 18+ and npm
- A [Zapier](https://zapier.com) account for email automation
- Modern browser with camera support for QR scanning

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd check-in
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Zapier Webhook URLs
NEXT_PUBLIC_ZAPIER_QR_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/123456/abcdef/
NEXT_PUBLIC_ZAPIER_CHECKIN_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/123456/ghijkl/
```

**To set up Zapier webhooks:**
1. Visit [zapier.com](https://zapier.com) and sign up
2. Create a new Zap with "Webhook by Zapier" as the trigger
3. Choose "Catch Hook" and copy the webhook URL
4. Set up your automation flow (email, Slack, etc.)
5. Create separate Zaps for QR generation and check-in events

### 3. Development
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📖 How to Use

### For Meeting Organizers (Create QR Codes)
1. Go to **Create QR Code** page
2. Fill in visitor details:
   - Visitor name and company
   - Visitor email address  
   - Purpose of visit
   - Host email for notifications
3. Submit to generate QR code
4. System automatically sends QR code to visitor via Zapier automation

### For Guest Services (Scan QR Codes)
1. Go to **Scan QR Code** page
2. Position visitor's QR code within camera frame
3. Add optional identification notes (e.g., "wearing blue jacket")
4. Add optional location notes (e.g., "seated in reception area")
5. Complete check-in to notify host via Zapier automation

## 🔗 Zapier Integration

The application sends webhook data to Zapier for automated email workflows:

### QR Code Generation Webhook Data
```json
{
  "visitorName": "John Doe",
  "visitorCompany": "Acme Corp",
  "visitorEmail": "john@acme.com",
  "purpose": "Product demo meeting",
  "hostEmail": "host@company.com",
  "qrCodeDataUrl": "data:image/png;base64,iVBOR...",
  "qrCodeData": "{visitor object as JSON}",
  "createdAt": "2024-01-01T10:00:00Z",
  "visitorId": "uuid",
  "action": "qr_code_generated"
}
```

### Check-in Webhook Data
```json
{
  "visitorName": "John Doe",
  "visitorCompany": "Acme Corp", 
  "visitorEmail": "john@acme.com",
  "purpose": "Product demo meeting",
  "hostEmail": "host@company.com",
  "checkedInAt": "2024-01-01T10:30:00Z",
  "checkedInTime": "1/1/2024, 10:30:00 AM",
  "identificationNotes": "Wearing blue jacket",
  "locationNotes": "Seated in reception area",
  "visitorId": "uuid",
  "action": "visitor_checked_in"
}
```

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── create/            # QR code generation page
│   ├── checkin/           # QR code scanning page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── QRGenerator.tsx    # QR code generation component
│   ├── QRScanner.tsx      # QR code scanning component
│   └── ui/               # shadcn/ui components
├── types/                # TypeScript type definitions
└── lib/                  # Utility functions
```

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/) for consistent, accessible design:

- **Cards**: Structured content display
- **Forms**: Input validation with real-time feedback  
- **Buttons**: Interactive elements with loading states
- **Alerts**: Status messages and error handling
- **Badges**: Information tags and labels
- **Toasts**: Success/error notifications

## 📱 Mobile Optimization

- **Responsive Design**: Works on all screen sizes
- **Touch-Friendly**: Large buttons and touch targets
- **Camera Access**: Optimized QR scanning on mobile devices
- **Performance**: Fast loading and smooth interactions

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Manual Deployment
1. Build the application: `npm run build`
2. Deploy the `.next` folder to your hosting provider
3. Set environment variables on your hosting platform
4. Ensure camera permissions are available (HTTPS required)

## 🔒 Security

- **Environment Variables**: Sensitive data stored securely
- **Client-Side Validation**: Input sanitization and validation
- **Webhook Security**: URLs can be kept private in environment variables
- **HTTPS Required**: Camera access requires secure connection

## 🛠 Development

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production  
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript checks

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code style consistency
- **shadcn/ui**: Consistent component library

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For support and questions:

- Create an issue in this repository
- Check the [Zapier documentation](https://zapier.com/help) for webhook setup
- Review [Next.js documentation](https://nextjs.org/docs) for framework questions

---

**Built with ❤️ using Next.js, shadcn/ui, and Zapier automation**
