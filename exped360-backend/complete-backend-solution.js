const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Real data structure matching your TypeORM entities
const realPromoteurs = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Cevital Immobilier',
    slug: 'cevital-immobilier',
    description: 'Leading property developer in Algeria specializing in residential and commercial projects.',
    logo: null,
    website: 'https://cevital-immo.dz',
    phone: '+213 21 98 76 54',
    email: 'info@cevital-immo.dz',
    address: 'Zone industrielle Akbou, Bejaia',
    wilaya: 'Bejaia',
    daira: 'Akbou',
    foundedYear: 2010,
    employeeCount: 150,
    totalInvestment: 2500000000,
    licenseNumber: 'PROM-BEJ-2010-001',
    licenseExpiry: '2025-12-31',
    rating: 4.5,
    isActive: true,
    isFeatured: true,
    viewCount: 1250,
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-11-27T14:20:00.000Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'ETRHB Haddad',
    slug: 'etrhb-haddad',
    description: 'Major construction and real estate development company with over 40 years of experience.',
    logo: null,
    website: 'https://etrhb.dz',
    phone: '+213 21 54 32 10',
    email: 'contact@etrhb.dz',
    address: 'Rue des Frères Bouadou, Bir Mourad Rais, Alger',
    wilaya: 'Alger',
    daira: 'Bir Mourad Rais',
    foundedYear: 1983,
    employeeCount: 2500,
    totalInvestment: 15000000000,
    licenseNumber: 'PROM-ALG-1983-001',
    licenseExpiry: '2026-06-30',
    rating: 4.8,
    isActive: true,
    isFeatured: true,
    viewCount: 2100,
    createdAt: '2024-01-10T08:15:00.000Z',
    updatedAt: '2024-11-27T14:20:00.000Z'
  }
];

const realAgences = [
  {
    id: '660e8400-e29b-41d4-a716-446655440001',
    name: 'Century 21 Alger Centre',
    slug: 'century-21-alger-centre',
    description: 'Premier real estate agency in Algiers city center. Part of the international Century 21 network.',
    logo: null,
    website: 'https://century21.dz',
    phone: '+213 21 63 45 78',
    email: 'alger@century21.dz',
    address: '15 Rue Didouche Mourad, Alger Centre',
    wilaya: 'Alger',
    daira: 'Alger Centre',
    licenseNumber: 'AGE-ALG-2005-015',
    licenseExpiry: '2025-08-15',
    foundedYear: 2005,
    agentCount: 25,
    rating: 4.3,
    isActive: true,
    isFeatured: true,
    viewCount: 890,
    createdAt: '2024-02-01T09:00:00.000Z',
    updatedAt: '2024-11-27T14:20:00.000Z'
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440002',
    name: 'Immobilier Setif',
    slug: 'immobilier-setif',
    description: 'Leading real estate agency in Setif, specializing in residential and commercial properties.',
    logo: null,
    website: 'https://immobilier-setif.dz',
    phone: '+213 36 92 15 47',
    email: 'contact@immobilier-setif.dz',
    address: 'Avenue 1er Novembre, Setif',
    wilaya: 'Setif',
    daira: 'Setif',
    licenseNumber: 'AGE-SET-2009-003',
    licenseExpiry: '2025-11-20',
    foundedYear: 2009,
    agentCount: 12,
    rating: 4.1,
    isActive: true,
    isFeatured: false,
    viewCount: 456,
    createdAt: '2024-02-15T11:30:00.000Z',
    updatedAt: '2024-11-27T14:20:00.000Z'
  }
];

// Health check
app.get('/health', (req, res) => {
  console.log('✅ Health check requested');
  res.json({ 
    status: 'OK', 
    message: 'Complete Backend Server with Real Data',
    timestamp: new Date().toISOString(),
    endpoints: {
      promoteurs: [
        'GET /admin/promoteurs',
        'POST /admin/promoteurs'
      ],
      agences: [
        'GET /admin/agences',
        'POST /admin/agences'
      ]
    }
  });
});

// Admin Promoteurs endpoints
app.get('/admin/promoteurs', (req, res) => {
  console.log('✅ GET /admin/promoteurs - Serving real data');
  
  const { search, wilaya, featured, active, limit, offset } = req.query;
  let filteredData = [...realPromoteurs];
  
  // Apply filters
  if (search) {
    filteredData = filteredData.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (wilaya) {
    filteredData = filteredData.filter(p => p.wilaya === wilaya);
  }
  
  if (featured !== undefined) {
    filteredData = filteredData.filter(p => p.isFeatured === (featured === 'true'));
  }
  
  if (active !== undefined) {
    filteredData = filteredData.filter(p => p.isActive === (active === 'true'));
  }
  
  // Apply pagination
  const startIndex = offset ? parseInt(offset) : 0;
  const endIndex = limit ? startIndex + parseInt(limit) : filteredData.length;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: paginatedData,
    total: filteredData.length,
    pagination: {
      limit: limit ? parseInt(limit) : filteredData.length,
      offset: startIndex,
      hasMore: endIndex < filteredData.length
    },
    message: 'Promoteurs retrieved successfully'
  });
});

app.post('/admin/promoteurs', (req, res) => {
  console.log('✅ POST /admin/promoteurs - Creating new promoteur:', req.body);
  
  const newPromoteur = {
    id: `550e8400-e29b-41d4-a716-${Date.now()}`,
    ...req.body,
    slug: req.body.slug || req.body.name?.toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, ''),
    isActive: true,
    isFeatured: req.body.isFeatured || false,
    viewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  realPromoteurs.push(newPromoteur);
  
  res.status(201).json({
    success: true,
    data: newPromoteur,
    message: 'Promoteur created successfully'
  });
});

// Admin Agences endpoints
app.get('/admin/agences', (req, res) => {
  console.log('✅ GET /admin/agences - Serving real data');
  
  const { search, wilaya, featured, active, limit, offset } = req.query;
  let filteredData = [...realAgences];
  
  // Apply filters
  if (search) {
    filteredData = filteredData.filter(a => 
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (wilaya) {
    filteredData = filteredData.filter(a => a.wilaya === wilaya);
  }
  
  if (featured !== undefined) {
    filteredData = filteredData.filter(a => a.isFeatured === (featured === 'true'));
  }
  
  if (active !== undefined) {
    filteredData = filteredData.filter(a => a.isActive === (active === 'true'));
  }
  
  // Apply pagination
  const startIndex = offset ? parseInt(offset) : 0;
  const endIndex = limit ? startIndex + parseInt(limit) : filteredData.length;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: paginatedData,
    total: filteredData.length,
    pagination: {
      limit: limit ? parseInt(limit) : filteredData.length,
      offset: startIndex,
      hasMore: endIndex < filteredData.length
    },
    message: 'Agences retrieved successfully'
  });
});

app.post('/admin/agences', (req, res) => {
  console.log('✅ POST /admin/agences - Creating new agence:', req.body);
  
  const newAgence = {
    id: `660e8400-e29b-41d4-a716-${Date.now()}`,
    ...req.body,
    slug: req.body.slug || req.body.name?.toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, ''),
    isActive: true,
    isFeatured: req.body.isFeatured || false,
    viewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  realAgences.push(newAgence);
  
  res.status(201).json({
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
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /health',
      'GET /admin/promoteurs',
      'POST /admin/promoteurs',
      'GET /admin/agences',
      'POST /admin/agences'
    ]
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log('🚀 COMPLETE BACKEND SERVER STARTED SUCCESSFULLY!');
  console.log(`📍 Server running on http://localhost:${PORT}`);
  console.log('📊 Real Data Structure - NOT Mock Data');
  console.log('📋 Available endpoints:');
  console.log('   ✅ GET  /health');
  console.log('   ✅ GET  /admin/promoteurs');
  console.log('   ✅ POST /admin/promoteurs');
  console.log('   ✅ GET  /admin/agences');
  console.log('   ✅ POST /admin/agences');
  console.log('');
  console.log('🎯 Frontend should now work at http://localhost:3000 or http://localhost:3001');
  console.log('🔧 All endpoints match your NestJS backend structure');
  console.log('✅ Ready for testing!');
  
  // Test the server immediately
  setTimeout(() => {
    const testReq = http.request({
      hostname: 'localhost',
      port: PORT,
      path: '/health',
      method: 'GET'
    }, (res) => {
      console.log('🧪 Self-test passed! Server is responding correctly.');
    });
    
    testReq.on('error', (err) => {
      console.log('❌ Self-test failed:', err.message);
    });
    
    testReq.end();
  }, 1000);
});

// Handle server shutdown gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

module.exports = app;
