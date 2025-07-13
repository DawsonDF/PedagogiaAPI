# 📋 PedagogiaAPI

![Status](https://img.shields.io/badge/Status-Work%20in%20Progress-yellow)
![Development](https://img.shields.io/badge/Development-Active-brightgreen)
![Version](https://img.shields.io/badge/Version-0.1.0--alpha-orange)

> ⚠️ **This project is currently under active development and is not ready for production use.**

A modern, full-stack web application for managing and documenting API endpoints. Built with SvelteKit, TypeScript, Prisma, and PostgreSQL.

## 🎯 What This App Does

This application provides a clean, intuitive interface for:

- **📝 Creating API endpoints** - Add new API endpoints with name, path, HTTP method, and description
- **✏️ Editing endpoints** - Update existing endpoint details with a smooth modal interface
- **🗑️ Deleting endpoints** - Remove endpoints with confirmation dialogs
- **📊 Viewing all endpoints** - Browse all API endpoints in a modern, responsive card layout
- **🔍 Real-time feedback** - Instant updates with smooth animations and toast notifications

## 📸 Screenshots

### Dashboard Overview

![Dashboard](docs/screenshots/DASHBOARD.png)

### Editing Endpoints

![Edit Modal](docs/screenshots/EDIT.png)

## 🚧 Project Status

**Current Phase**: Early Development (Alpha)

This project is actively being developed and is **not yet ready for production use**. Here's what you can expect:

### ✅ What's Working

- Basic CRUD operations for API endpoints
- Modern UI with responsive design
- Database integration with PostgreSQL
- Real-time updates and animations

### 🔄 Currently Working On

- User authentication and authorization
- Admin page with user management and role-based access control

### 📋 Planned Features

- Support collections of APIs for documentation and management
- Team collaboration features
- API versioning support
- Integration with external API tools
- Comprehensive test coverage
- Docker deployment optimization

**Last Updated**: July 2025

### Key Features

- 🎨 **Modern UI** with glassmorphism design and Tailwind CSS v4
- ⚡ **Real-time updates** with hot module replacement
- 🔐 **Type-safe** development with TypeScript
- 📱 **Responsive design** that works on all devices
- ♿ **Accessible** with proper ARIA labels and keyboard navigation
- 🎭 **Smooth animations** for all user interactions

## 🛠️ Technology Stack

- **Frontend**: SvelteKit 2 + TypeScript
- **Styling**: Tailwind CSS v4 with custom animations
- **Database**: PostgreSQL with Prisma ORM
- **Build Tool**: Vite with HMR
- **Deployment**: Adapter-auto (supports Vercel, Netlify, etc.)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **pnpm**/**yarn**
- **Docker** & **Docker Compose** - [Download here](https://www.docker.com/get-started/)
- **Git** - [Download here](https://git-scm.com/)

### Verify Installation

```bash
node --version    # Should be v18+
npm --version     # Should be v8+
docker --version  # Should be v20+
git --version     # Any recent version
```

## 🚀 Quick Start Guide

> **⚠️ Development Setup**: This guide is for development purposes only. The application is not yet ready for production deployment.

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd PedagogiaAPI
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/pedagogia_api_db"
POSTGRES_PASSWORD=your_strong_password

# pgAdmin (Optional - for database management UI)
PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=admin_password
```

### 3. Start Database

```bash
# Start PostgreSQL and pgAdmin with Docker
docker-compose up -d

# Verify containers are running
docker-compose ps
```

### 4. Setup Database Schema

```bash
# Generate Prisma client
npx prisma generate

# Apply database schema
npx prisma db push

# (Optional) Seed with sample data
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
```

🎉 **You're ready!** The app will be available at:

- **Main App**: http://localhost:5173
- **pgAdmin**: http://localhost:8080 (database management)

## 📁 Project Structure

```
PedagogiaAPI/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte          # Global layout
│   │   ├── +page.svelte            # Main page (endpoint management)
│   │   └── api/
│   │       └── endpoints/
│   │           ├── +server.ts      # API: CRUD operations
│   │           └── [id]/
│   │               └── +server.ts  # API: Individual endpoint ops
│   ├── lib/
│   │   └── server/
│   │       └── prisma.ts           # Database client
│   ├── app.css                     # Global styles + Tailwind
│   └── app.html                    # HTML template
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── migrations/                 # Database migrations
├── static/                         # Static assets
├── docker-compose.yml              # Database services
├── vite.config.ts                  # Vite configuration
└── tailwind.config.js              # Tailwind CSS config
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run dev -- --open # Start dev server and open browser

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Database
npx prisma studio    # Open database browser
npx prisma generate  # Regenerate Prisma client
npx prisma db push   # Apply schema changes

# Code Quality
npm run check        # Type check
npm run check:watch  # Type check in watch mode
```

## 🌐 API Endpoints

The application provides the following REST API endpoints:

| Method   | Endpoint              | Description            |
| -------- | --------------------- | ---------------------- |
| `GET`    | `/api/endpoints`      | List all API endpoints |
| `POST`   | `/api/endpoints`      | Create new endpoint    |
| `GET`    | `/api/endpoints/[id]` | Get specific endpoint  |
| `PUT`    | `/api/endpoints/[id]` | Update endpoint        |
| `DELETE` | `/api/endpoints/[id]` | Delete endpoint        |

### Example API Usage

```bash
# Get all endpoints
curl http://localhost:5173/api/endpoints

# Create new endpoint
curl -X POST http://localhost:5173/api/endpoints \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Get Users",
    "path": "/api/users",
    "method": "GET",
    "description": "Retrieve all users"
  }'
```

## 🗄️ Database Schema

```sql
-- ApiEndpoint table
CREATE TABLE "ApiEndpoint" (
    "id"          TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "name"        TEXT UNIQUE NOT NULL,
    "path"        TEXT NOT NULL,
    "method"      TEXT NOT NULL,
    "description" TEXT,
    "createdAt"   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deployment Options

This project uses `@sveltejs/adapter-auto` which automatically detects your deployment platform:

- **Vercel**: Zero-config deployment
- **Netlify**: Automatic builds from Git
- **Docker**: Containerized deployment
- **Node.js**: Traditional server deployment

### Environment Variables for Production

Make sure to set these in your production environment:

```env
DATABASE_URL=postgresql://user:password@host:port/database
POSTGRES_PASSWORD=your_password_here
```

## 🛠️ Development Tips

### Hot Module Replacement

- Save any file and see changes instantly
- CSS changes apply without page refresh
- Component state is preserved during updates

### Database Management

```bash
# View database in browser
npx prisma studio

# Reset database (development only)
npx prisma migrate reset

# Generate new migration
npx prisma migrate dev --name your_migration_name
```

### Debugging

- TypeScript errors appear in terminal and browser
- Use browser DevTools for client-side debugging
- Check terminal for server-side logs

## 🔧 Troubleshooting

### Common Issues

**Port already in use:**

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

**Database connection failed:**

```bash
# Check if containers are running
docker-compose ps

# Restart database
docker-compose restart db

# Check logs
docker-compose logs db
```

**Prisma client issues:**

```bash
# Regenerate client
npx prisma generate

# Reset and regenerate
rm -rf node_modules/.prisma
npx prisma generate
```

**Build errors:**

```bash
# Clear build cache
rm -rf .svelte-kit build

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contributing

**Note**: This project is in early development. Contributions are welcome, but please note that the API and structure may change significantly.

### How to Contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm run check`
5. Commit changes: `git commit -m 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Submit a pull request

### Before Contributing

- Check the [Project Status](#-project-status) section for current priorities
- Look at open issues to see what needs help
- Consider reaching out via issues before starting major changes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub issues](link-to-issues)
3. Create a new issue with:
   - Your operating system
   - Node.js version
   - Error messages
   - Steps to reproduce

---

**Happy coding!** 🎉
