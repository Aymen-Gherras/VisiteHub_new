# VisiteHub Frontend Setup

## Prerequisites

1. **Node.js**
   - Install Node.js (version 18 or higher)

2. **Backend API**
   - Ensure the backend is running on `http://localhost:3000`

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3001`

## Features

- **Property Listings:** Browse all available properties
- **Property Details:** View detailed information about each property
- **Search & Filter:** Filter properties by type, price, location, etc.
- **Responsive Design:** Works on desktop, tablet, and mobile devices

## API Integration

The frontend connects to the backend API at `http://localhost:3000`. The main API endpoints used are:

- `GET /properties` - Get all properties
- `GET /properties/:id` - Get property details
- `POST /properties` - Create new property (requires authentication)
- `PATCH /properties/:id` - Update property (requires authentication)
- `DELETE /properties/:id` - Delete property (requires authentication)

## Environment Variables

The frontend uses the following environment variables:

- `NEXT_PUBLIC_API_URL` - Backend API URL (defaults to `http://localhost:3000/api`)

## Development

- **Hot Reload:** Changes are automatically reflected in the browser
- **TypeScript:** Full TypeScript support for better development experience
- **Tailwind CSS:** Utility-first CSS framework for styling

## Building for Production

```bash
npm run build
npm start
```

## Testing

The application includes:

- **Cypress E2E Tests:** Located in the `cypress/` directory
- **Component Testing:** Individual component tests
- **API Integration Tests:** Tests for backend connectivity
