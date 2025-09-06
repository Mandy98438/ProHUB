# ProHUB Server

Backend server for the ProHUB project management application.

## Features

- Express.js REST API
- CORS enabled for frontend integration
- Environment configuration
- Health check endpoints
- Project and task management endpoints
- Authentication endpoints (ready for implementation)

## Quick Start

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Copy environment file:
   ```bash
   cp env.example .env
   ```

3. Update the `.env` file with your configuration

4. Start the server:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Health Check
- `GET /` - Server status
- `GET /api/health` - Health check

### Projects
- `GET /api/projects` - Get all projects

### Tasks
- `GET /api/tasks` - Get all tasks

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

## Environment Variables

See `env.example` for required environment variables.

## Development

The server runs on port 5000 by default and supports hot reloading with nodemon in development mode.
