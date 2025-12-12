const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3003; // Different port to avoid conflicts

// Middleware
app.use(cors());
app.use(express.json());

// Test data
const mockPromoteurs = [
  {
    id: '1',
    name: 'Cevital Immobilier',
    slug: 'cevital-immobilier',
    description: 'Leading property developer in Algeria',
    logo: null,
    website: 'https://cevital-immo.dz',
    phone: '+213 21 XX XX XX',
    email: 'info@cevital-immo.dz',
    wilaya: 'Alger',
    daira: 'Sidi Abdellah',
    foundedYear: 2010,
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString()
  }
];

const mockAgences = [
  {
    id: '1',
    name: 'Century 21 Alger',
    slug: 'century-21-alger',
    description: 'Premier real estate agency in Algeria',
    logo: null,
    website: 'https://century21.dz',
    phone: '+213 21 XX XX XX',
    email: 'contact@century21.dz',
    wilaya: 'Alger',
    daira: 'Centre',
    foundedYear: 2005,
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString()
  }
];

// Routes - exactly matching the frontend calls
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Test admin endpoints server is running' });
});

// Admin endpoints (no auth for testing)
app.get('/admin/promoteurs', (req, res) => {
  console.log('✅ GET /admin/promoteurs called');
  res.json({
    success: true,
    data: mockPromoteurs,
    total: mockPromoteurs.length,
    message: 'Promoteurs retrieved successfully'
  });
});

app.post('/admin/promoteurs', (req, res) => {
  console.log('✅ POST /admin/promoteurs called with:', req.body);
  const newPromoteur = {
    id: Date.now().toString(),
    ...req.body,
    slug: req.body.name?.toLowerCase().replace(/\s+/g, '-') || 'new-promoteur',
    isActive: true,
    isFeatured: false,
    createdAt: new Date().toISOString()
  };
  mockPromoteurs.push(newPromoteur);
  res.json({
    success: true,
    data: newPromoteur,
    message: 'Promoteur created successfully'
  });
});

app.get('/admin/agences', (req, res) => {
  console.log('✅ GET /admin/agences called');
  res.json({
    success: true,
    data: mockAgences,
    total: mockAgences.length,
    message: 'Agences retrieved successfully'
  });
});

app.post('/admin/agences', (req, res) => {
  console.log('✅ POST /admin/agences called with:', req.body);
  const newAgence = {
    id: Date.now().toString(),
    ...req.body,
    slug: req.body.name?.toLowerCase().replace(/\s+/g, '-') || 'new-agence',
    isActive: true,
    isFeatured: false,
    createdAt: new Date().toISOString()
  };
  mockAgences.push(newAgence);
  res.json({
    success: true,
    data: newAgence,
    message: 'Agence created successfully'
  });
});

// Catch all other routes
app.use('*', (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test Admin Endpoints Server running on http://localhost:${PORT}`);
  console.log(`📋 Available routes:`);
  console.log(`   GET  /health`);
  console.log(`   GET  /admin/promoteurs`);
  console.log(`   POST /admin/promoteurs`);
  console.log(`   GET  /admin/agences`);
  console.log(`   POST /admin/agences`);
  console.log('');
  console.log('🔧 To test with frontend:');
  console.log('   1. Update frontend API base URL to http://localhost:3003');
  console.log('   2. Or proxy requests from 3002 to 3003');
});

module.exports = app;
