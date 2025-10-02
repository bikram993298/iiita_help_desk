# IIITA Helpdesk - Student Complaint Management System

A modern, responsive web application for managing student complaints at IIIT Allahabad.

## Features

- **Student Dashboard**: Submit and track complaints with real-time status updates
- **Admin Dashboard**: Manage and resolve complaints with comprehensive filtering
- **Authentication**: JWT-based login/signup with role-based access control
- **Real-time Updates**: Live complaint status tracking
- **Search & Filter**: Advanced filtering by category, priority, and status
- **Dark Mode**: Toggle between light and dark themes
- **Mobile Responsive**: Optimized for all device sizes

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with JWT
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new Supabase project
   - Copy your project URL and anon key
   - Create a `.env` file based on `.env.example`
   - Run the database migration in the Supabase SQL editor

4. Start the development server:
   ```bash
   npm run dev
   ```

### Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the migration script from `supabase/migrations/create_database_schema.sql`
4. This will create the necessary tables, policies, and security rules

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── context/            # React context providers
├── lib/                # Configuration and utilities
├── pages/              # Page components
├── services/           # API service layers
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
```

## Database Schema

### Users Table
- `id`: UUID (Primary Key, references auth.users)
- `email`: Text (Unique)
- `name`: Text
- `role`: Enum ('student', 'admin')
- `student_id`: Text (Nullable for admins)
- `created_at`, `updated_at`: Timestamps

### Complaints Table
- `id`: UUID (Primary Key)
- `title`: Text
- `description`: Text
- `category`: Text
- `priority`: Enum ('low', 'medium', 'high', 'urgent')
- `status`: Enum ('pending', 'in-progress', 'resolved', 'rejected')
- `student_id`: UUID (Foreign Key to users)
- `admin_notes`: Text (Nullable)
- `created_at`, `updated_at`: Timestamps

## Security

- Row Level Security (RLS) enabled on all tables
- Students can only access their own complaints
- Admins have full access to manage all complaints
- JWT-based authentication with secure session management

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend Migration to MySQL
To migrate to MySQL with Express.js backend:

1. Update the service files to use MySQL queries instead of Supabase
2. Create equivalent database schema in MySQL
3. Implement JWT authentication middleware
4. Deploy backend to Railway/Render

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details