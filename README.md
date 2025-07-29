# Visitor Check-In QR Code System

A professional Next.js application that provides a complete visitor management solution using QR codes, built with shadcn/ui for enterprise-grade design.

## 🚀 Features

- **QR Code Generation**: Hosts can create visitor invites with embedded meeting details
- **Camera Scanning**: Guest services can scan QR codes using device cameras
- **Email Notifications**: Automatic confirmation emails sent to hosts upon check-in
- **Professional UI**: Built with shadcn/ui for consistent, accessible design
- **Mobile Responsive**: Optimized for all device sizes and screen orientations
- **Real-time Validation**: Form validation and error handling throughout the flow

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **QR Codes**: qrcode (generation) + html5-qrcode (scanning)
- **Email**: Resend API for notifications
- **TypeScript**: Full type safety throughout

## 📋 Prerequisites

- Node.js 18+ and npm
- A [Resend](https://resend.com) account for email functionality
- Modern browser with camera support for QR scanning

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd visitor-checkin
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Resend API Configuration
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=noreply@yourdomain.com
```

**To get your Resend API key:**
1. Visit [resend.com](https://resend.com)
2. Sign up (free plan includes 100 emails/day)
3. Go to API Keys section
4. Generate a new API key
5. Add it to your `.env.local` file

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 How to Use

### For Hosts (Creating Visitor Invites)

1. **Navigate to Home Page** → Click "Create Visitor Invite"
2. **Fill Visitor Information**:
   - Visitor name and company
   - Purpose of visit (detailed description)
   - Meeting room/location
3. **Add Host Details**:
   - Your name
   - Your email (for notifications)
4. **Generate QR Code** → Share with your visitor

### For Guest Services (Checking In Visitors)

1. **Navigate to Home Page** → Click "Start QR Scanner"
2. **Allow Camera Permission**
3. **Scan Visitor's QR Code**
4. **Complete Check-In Form**:
   - Verify visitor identity
   - Record check-in location
   - Add staff member name
5. **Submit** → Host receives automatic email notification

## 🏗 Project Structure

```
visitor-checkin/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/
│   │   │   └── send-confirmation/  # Email API endpoint
│   │   ├── create/             # Host: Create visitor invite
│   │   ├── checkin/            # Guest Services: QR scanner & check-in
│   │   ├── confirmation/       # Success/completion page
│   │   ├── layout.tsx          # Root layout with Toaster
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── Layout/
│   │   │   └── StepLayout.tsx  # Consistent page layout
│   │   ├── QRGenerator.tsx     # QR code generation
│   │   ├── QRScanner.tsx       # Camera-based scanning
│   │   ├── CheckInForm.tsx     # Guest services form
│   │   ├── VisitorSummary.tsx  # Confirmation display
│   │   └── StepProgress.tsx    # Progress indicator
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   └── lib/
│       └── utils.ts            # Utility functions
```

## 🎨 Components Overview

### Core Components

- **`QRGenerator`**: Generates QR codes with visitor data, includes copy/download functionality
- **`QRScanner`**: Camera interface for scanning QR codes with permission handling
- **`CheckInForm`**: Form for guest services to complete visitor check-in
- **`VisitorSummary`**: Professional summary of completed check-in
- **`StepProgress`**: Visual progress indicator across the 3-step flow

### Layout Components

- **`StepLayout`**: Consistent layout wrapper with progress tracking
- **Shadcn/ui Components**: Professional UI components throughout

## 🔧 Configuration

### Email Templates
The system sends HTML emails with:
- Professional styling and branding
- Complete visitor and check-in details
- Mobile-responsive design
- Both HTML and plain text versions

### QR Code Settings
- **Error Correction**: High level for reliability
- **Size**: 300px for optimal scanning
- **Data Format**: JSON with visitor information
- **Validation**: Built-in data integrity checks

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Build the project
npm run build

# Deploy to Vercel
npx vercel

# Add environment variables in Vercel dashboard:
# - RESEND_API_KEY
# - FROM_EMAIL
```

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- Self-hosted with Docker

## 🔒 Security & Privacy

- **No Data Storage**: Visitor information is not stored in databases
- **QR Code Security**: Data is embedded directly in QR codes
- **Email Encryption**: All email communication is encrypted
- **Camera Permissions**: Proper handling of camera access requests
- **Input Validation**: All forms include comprehensive validation

## 📱 Mobile Optimization

- **Responsive Design**: Works on all screen sizes
- **Touch-Friendly**: Large buttons and touch targets
- **Camera Integration**: Optimized for mobile QR scanning
- **Fast Loading**: Optimized bundle size and lazy loading

## 🔄 Development Workflow

### Adding New Features
1. Create TypeScript interfaces in `src/types/`
2. Build reusable components in `src/components/`
3. Add pages in `src/app/`
4. Update navigation and routing as needed

### Available Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
```

## 🐛 Troubleshooting

### Common Issues

**QR Scanner Not Working**
- Ensure HTTPS (required for camera access)
- Check browser camera permissions
- Try different browsers (Chrome/Safari recommended)

**Email Not Sending**
- Verify RESEND_API_KEY in environment variables
- Check FROM_EMAIL format and domain verification
- Review Resend dashboard for error logs

**Build Errors**
- Clear `.next` folder and `node_modules`
- Run `npm install` and `npm run build`
- Check TypeScript errors with `npm run type-check`

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review [Next.js documentation](https://nextjs.org/docs)
3. Check [shadcn/ui documentation](https://ui.shadcn.com)
4. Open an issue in the repository

---

**Built with ❤️ using Next.js and shadcn/ui**
