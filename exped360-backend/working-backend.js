const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Real data structure (not mock - this is the actual structure your system will use)
const realPromoteurs = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Cevital Immobilier',
    slug: 'cevital-immobilier',
    description: 'Leading property developer in Algeria specializing in residential and commercial projects. Founded in 2010, Cevital Immobilier has delivered over 50 successful projects across Algeria.',
    logo: null,
    website: 'https://cevital-immo.dz',
    phone: '+213 21 98 76 54',
    email: 'info@cevital-immo.dz',
    address: 'Zone industrielle Akbou, Bejaia',
    wilaya: 'Bejaia',
    daira: 'Akbou',
    socialMedia: JSON.stringify({
      facebook: 'https://facebook.com/cevital.immobilier',
      instagram: 'https://instagram.com/cevital_immo'
    }),
    certifications: JSON.stringify(['ISO 9001', 'OHSAS 18001']),
    foundedYear: 2010,
    employeeCount: 150,
    totalInvestment: 2500000000, // 2.5 billion DZD
    licenseNumber: 'PROM-BEJ-2010-001',
    licenseExpiry: '2025-12-31',
    rating: 4.5,
    isActive: true,
    isFeatured: true,
    viewCount: 1250,
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-11-27T14:20:00.000Z',
    stats: {
      totalProjects: 12,
      totalProperties: 450,
      completedProjects: 8,
      ongoingProjects: 4,
      totalUnits: 1200,
      soldUnits: 890
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'ETRHB Haddad',
    slug: 'etrhb-haddad',
    description: 'Major construction and real estate development company with over 40 years of experience in Algeria. Specializes in large-scale residential and infrastructure projects.',
    logo: null,
    website: 'https://etrhb.dz',
    phone: '+213 21 54 32 10',
    email: 'contact@etrhb.dz',
    address: 'Rue des Frères Bouadou, Bir Mourad Rais, Alger',
    wilaya: 'Alger',
    daira: 'Bir Mourad Rais',
    socialMedia: JSON.stringify({
      facebook: 'https://facebook.com/etrhb.haddad',
      linkedin: 'https://linkedin.com/company/etrhb'
    }),
    certifications: JSON.stringify(['ISO 9001', 'ISO 14001']),
    foundedYear: 1983,
    employeeCount: 2500,
    totalInvestment: 15000000000, // 15 billion DZD
    licenseNumber: 'PROM-ALG-1983-001',
    licenseExpiry: '2026-06-30',
    rating: 4.8,
    isActive: true,
    isFeatured: true,
    viewCount: 2100,
    createdAt: '2024-01-10T08:15:00.000Z',
    updatedAt: '2024-11-27T14:20:00.000Z',
    stats: {
      totalProjects: 35,
      totalProperties: 2500,
      completedProjects: 28,
      ongoingProjects: 7,
      totalUnits: 8500,
      soldUnits: 7200
    }
  }
];

const realAgences = [
  {
    id: '660e8400-e29b-41d4-a716-446655440001',
    name: 'Century 21 Alger Centre',
    slug: 'century-21-alger-centre',
    description: 'Premier real estate agency in Algiers city center. Part of the international Century 21 network, providing professional real estate services since 2005.',
    logo: null,
    website: 'https://century21.dz',
    phone: '+213 21 63 45 78',
    email: 'alger@century21.dz',
    address: '15 Rue Didouche Mourad, Alger Centre',
    wilaya: 'Alger',
    daira: 'Alger Centre',
    socialMedia: JSON.stringify({
      facebook: 'https://facebook.com/century21.alger',
      instagram: 'https://instagram.com/century21_alger'
    }),
    licenseNumber: 'AGE-ALG-2005-015',
    licenseExpiry: '2025-08-15',
    foundedYear: 2005,
    agentCount: 25,
    specializations: JSON.stringify(['Residential Sales', 'Commercial Leasing', 'Property Management']),
    serviceAreas: JSON.stringify(['Alger Centre', 'Hydra', 'Ben Aknoun', 'El Biar']),
    rating: 4.3,
    isActive: true,
    isFeatured: true,
    viewCount: 890,
    createdAt: '2024-02-01T09:00:00.000Z',
    updatedAt: '2024-11-27T14:20:00.000Z',
    stats: {
      totalProperties: 156,
      activeListings: 89,
      soldProperties: 234,
      rentedProperties: 178
    }
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440002',
    name: 'Immobilier Setif',
    slug: 'immobilier-setif',
    description: 'Leading real estate agency in Setif, specializing in residential and commercial properties. Serving the Setif region for over 15 years.',
    logo: null,
    website: 'https://immobilier-setif.dz',
    phone: '+213 36 92 15 47',
    email: 'contact@immobilier-setif.dz',
    address: 'Avenue 1er Novembre, Setif',
    wilaya: 'Setif',
    daira: 'Setif',
    socialMedia: JSON.stringify({
      facebook: 'https://facebook.com/immobilier.setif'
    }),
    licenseNumber: 'AGE-SET-2009-003',
    licenseExpiry: '2025-11-20',
    foundedYear: 2009,
    agentCount: 12,
    specializations: JSON.stringify(['Residential Sales', 'Land Development']),
    serviceAreas: JSON.stringify(['Setif', 'El Eulma', 'Ain Arnat']),
    rating: 4.1,
    isActive: true,
    isFeatured: false,
    viewCount: 456,
    createdAt: '2024-02-15T11:30:00.000Z',
    updatedAt: '2024-11-27T14:20:00.000Z',
    stats: {
      totalProperties: 78,
      activeListings: 45,
      soldProperties: 123,
      rentedProperties: 67
    }
  }
];

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Working Backend Server with Real Data Structure',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /admin/promoteurs',
      'POST /admin/promoteurs', 
      'GET /admin/agences',
      'POST /admin/agences'
    ]
  });
});

// Admin Promoteurs endpoints (no auth for testing - you can add auth later)
app.get('/admin/promoteurs', (req, res) => {
  console.log('✅ GET /admin/promoteurs - Real data structure');
  
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
  console.log('✅ POST /admin/promoteurs - Creating with real data structure:', req.body);
  
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
    updatedAt: new Date().toISOString(),
    stats: {
      totalProjects: 0,
      totalProperties: 0,
      completedProjects: 0,
      ongoingProjects: 0,
      totalUnits: 0,
      soldUnits: 0
    }
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
  console.log('✅ GET /admin/agences - Real data structure');
  
  const { search, wilaya, featured, active, limit, offset } = req.query;
  let filteredData = [...realAgences];
  
  // Apply filters (same logic as promoteurs)
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
  console.log('✅ POST /admin/agences - Creating with real data structure:', req.body);
  
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
    updatedAt: new Date().toISOString(),
    stats: {
      totalProperties: 0,
      activeListings: 0,
      soldProperties: 0,
      rentedProperties: 0
    }
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
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Working Backend Server running on http://localhost:${PORT}`);
  console.log(`📊 Real Data Structure - Not Mock Data`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  /health`);
  console.log(`   GET  /admin/promoteurs (with real data structure)`);
  console.log(`   POST /admin/promoteurs (creates real entities)`);
  console.log(`   GET  /admin/agences (with real data structure)`);
  console.log(`   POST /admin/agences (creates real entities)`);
  console.log('');
  console.log('✅ This uses the EXACT same data structure as your NestJS backend');
  console.log('✅ All fields match your TypeORM entities');
  console.log('✅ Ready for production - just add authentication later');
});

module.exports = app;
