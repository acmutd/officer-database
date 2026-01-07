# ACM Officer Database - Frontend

This is the frontend repository for the ACM Officer Database, a comprehensive management platform for ACM officers at UTD.

## Key Features

### Authentication
- Firebase-based login flow
- Protected routes with automatic redirects
- ID token handling for secure API requests

### Officer Management
- View and edit personal profiles (name, photo, academics)
- Track internships with add/edit/delete capabilities
- Manage research experiences
- Update social links (LinkedIn, GitHub, email)
- Resume upload and management

### Directory & Search
- Browse all active officers
- Filter by division and access level
- View archived officer profiles
- Role-based access control

### Data Validation
- All API responses parsed against Zod schemas
- Type-safe query client with React Query
- Endpoint type safety via union types

## Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup
1. Clone the repository
```sh
$ git clone https://github.com/acmutd/officer-database.git
$ cd officer-database
```
2. Install dependencies
```sh
$ npm install
```

3. Build to make sure everything works
```sh
$ npm run build
```

4. Start the development server
```sh
$ npm run dev
```

The app will be available at `http://localhost:3000`

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (includes TypeScript check)
- `npm run serve` - Preview production build locally
- `npm run test` - Run test suite