# Exped360 Backend Setup

## Prerequisites

1. **PostgreSQL Database**
   - Install PostgreSQL on your system
   - Create a database named `exped360`

2. **Node.js**
   - Install Node.js (version 18 or higher)

## Environment Setup

1. **Create a `.env` file** in the root directory with the following content:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=exped360

# Application Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3001
```

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run start:dev
   ```

3. **Seed the database with sample data:**
   ```bash
   npm run seed
   ```

## API Endpoints

The API will be available at `http://localhost:3000`

- **Swagger Documentation:** `http://localhost:3000/api`
- **Properties API:** `http://localhost:3000/properties`
- **Auth API:** `http://localhost:3000/auth`

## Database Schema

The application uses TypeORM with PostgreSQL. The main entities are:

- **Properties:** Real estate listings
- **Users:** User accounts and authentication
- **Property Images:** Images associated with properties
- **Property Amenities:** Amenities for each property

## Testing

Run the test suite:
```bash
npm test
```

## Production

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Use a strong JWT secret
3. Configure proper CORS origins
4. Use environment-specific database credentials
