# Money Manager India

A comprehensive personal finance management application tailored specifically for Indian users. Track budgets, calculate EMIs, manage taxes, analyze salaries, and take control of your financial life with tools designed for the Indian financial ecosystem.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS with custom Indian-themed color palette
- **Backend**: Supabase (PostgreSQL) + Next.js Server Actions & API Routes
- **Authentication**: Supabase Auth with Row-Level Security (RLS)
- **Charts**: Recharts for financial visualizations
- **Forms**: React Hook Form + Zod for validation
- **PDF Export**: jsPDF + jsPDF-AutoTable
- **UI Components**: Radix UI
- **Hosting**: Vercel
- **Testing**: Jest + React Testing Library

## Features

### Core Features
- **Budget Management**: Create, track, and manage budgets across categories
- **Expense Tracking**: Record and categorize expenses with powerful filtering and search
- **Income Management**: Track salary, investments, and other income streams
- **Financial Dashboard**: Real-time financial overview with key metrics

### Specialized Tools
- **EMI Calculator**: Calculate Equated Monthly Installments for loans
- **Tax Calculator**: Calculate income tax based on Indian tax slabs
- **Salary Analyzer**: Break down salary components and deductions
- **Investment Tracker**: Track investments and returns
- **Recurring Expense Manager**: Setup and track recurring bills and payments

### Reports & Analytics
- **Transaction Reports**: Export transaction data to PDF and CSV
- **Expense Analysis**: Visual breakdown of spending by category and time period
- **Income vs Expense Reports**: Monthly/yearly comparison charts
- **Tax Reports**: Tax summary and deduction tracking

### Account Management
- **Multi-account Support**: Manage multiple bank accounts
- **User Authentication**: Secure Supabase authentication
- **Profile Management**: Customize account settings and preferences
- **Data Export**: Export all financial data

## Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm, yarn, pnpm, or bun
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/money-manager-india.git
   cd money-manager-india
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

4. **Setup Supabase**
   - Create a new project on [Supabase](https://supabase.com)
   - Run migrations: `npx supabase db push`
   - Configure RLS policies (see docs/ARCHITECTURE.md for details)
   - Setup any required triggers and functions

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Development Commands

```bash
# Start development server with hot reload
npm run dev

# Type checking
npm run type-check

# Run linter
npm run lint

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Build for production
npm run build

# Start production server
npm start

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

## Project Structure

```
money-manager-india/
├── docs/
│   ├── ARCHITECTURE.md      # System architecture and design
│   └── API.md               # API reference documentation
├── src/
│   ├── app/                 # Next.js 14 App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── api/            # API routes
│   │   ├── auth/           # Auth pages
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── budgets/        # Budget pages
│   │   ├── expenses/       # Expense pages
│   │   ├── tools/          # Calculator and tool pages
│   │   └── settings/       # Settings pages
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and libraries
│   │   └── supabase/       # Supabase client and helpers
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Helper utilities
├── tests/                   # Test files
├── public/                  # Static assets
├── .github/
│   ├── workflows/          # CI/CD workflows
│   └── ISSUE_TEMPLATE/     # Issue templates
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## Build and Deploy

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `.next` directory.

### Deploy on Vercel

The easiest way to deploy Money Manager India is to use [Vercel](https://vercel.com).

1. Push your code to GitHub
2. Import the project to Vercel
3. Add environment variables in Vercel dashboard
4. Vercel will automatically deploy on every push

For detailed deployment instructions, see the [Vercel documentation](https://vercel.com/docs).

### Deploy on Other Platforms

The application can be deployed to any platform that supports Node.js 18+, including:
- Heroku
- Railway
- Render
- AWS Amplify
- Azure App Service

Ensure that:
- Environment variables are properly configured
- Database migrations are run
- Build output is properly set up

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute to this project.

## Support

For issues, bug reports, or feature requests, please [create an issue](https://github.com/your-username/money-manager-india/issues) on GitHub.

For detailed documentation, see:
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Release Checklist](./RELEASE_CHECKLIST.md)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Disclaimer

This application is provided as-is for personal finance tracking purposes. Please ensure you comply with all local tax regulations and laws when using this tool. Always consult with a qualified financial advisor or tax professional for financial and investment decisions.

## Roadmap

- Mobile app (React Native)
- Advanced investment tracking
- Bank account auto-sync integration
- Bill payment reminders and automation
- Financial goal setting and tracking
- Multi-user household budgeting
- Dark mode
- Internationalization (support for other Indian languages)
