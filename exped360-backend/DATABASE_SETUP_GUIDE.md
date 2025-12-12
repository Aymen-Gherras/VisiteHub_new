# 🗄️ Database Setup Guide for Real Backend

## Quick Setup Options

### Option 1: Use Existing Database (Recommended)
If you already have a MySQL database with your property data:

1. **Copy environment file:**
   ```bash
   copy env.example .env
   ```

2. **Edit `.env` file with your database credentials:**
   ```env
   DB_TYPE=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=your_database_name
   JWT_SECRET=your_secure_random_string_here
   ```

3. **Run migrations to add new tables:**
   ```bash
   # The backend will automatically create the new tables when it starts
   npm run start:dev
   ```

### Option 2: Fresh Database Setup
If you need a new database:

1. **Install MySQL (if not installed):**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP: https://www.apachefriends.org/

2. **Create database:**
   ```sql
   CREATE DATABASE exped360_local CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'exped360_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON exped360_local.* TO 'exped360_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Configure `.env`:**
   ```env
   DB_TYPE=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=exped360_user
   DB_PASSWORD=your_password
   DB_DATABASE=exped360_local
   JWT_SECRET=your_secure_random_string_here
   ```

## 🚀 Starting the Real Backend

1. **Run the setup script:**
   ```bash
   setup-real-backend.bat
   ```

2. **Or manually start:**
   ```bash
   npm run start:dev
   ```

3. **Check if server is running:**
   - Visit: http://localhost:3002/health
   - Should return: `{"status":"OK"}`

## 🔧 Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check credentials in `.env` file
- Ensure database exists
- Check firewall settings

### Migration Issues
- The backend uses TypeORM with `synchronize: true` in development
- New tables will be created automatically
- Existing data will be preserved

### Port Issues
- Default port is 3002
- Change in `src/main.ts` if needed
- Ensure port is not in use

## 📊 Testing with Real Data

Once the backend is running:

1. **Admin Promoteurs:** http://localhost:3001/admin/promoteurs
2. **Admin Agences:** http://localhost:3001/admin/agences
3. **Create new entries through the admin interface**
4. **Data will be stored in your MySQL database**

## 🎯 Next Steps

After setup:
1. Create some test promoteurs and agences
2. Assign existing properties to them
3. Test the full workflow
4. Deploy to production when ready
