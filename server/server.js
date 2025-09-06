const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'ProHUB Server is running!',
    version: '1.0.0',
    status: 'active'
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Projects Routes
app.get('/api/projects', (req, res) => {
  res.json({ 
    projects: [],
    message: 'Projects endpoint ready'
  });
});

// Tasks Routes
app.get('/api/tasks', (req, res) => {
  res.json({ 
    tasks: [],
    message: 'Tasks endpoint ready'
  });
});

// Auth Routes
app.post('/api/auth/login', (req, res) => {
  res.json({ 
    message: 'Login endpoint ready',
    token: null
  });
});

app.post('/api/auth/register', (req, res) => {
  res.json({ 
    message: 'Register endpoint ready',
    user: null
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ProHUB Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
});
