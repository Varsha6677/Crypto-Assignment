# 🚀 CryptoTrack - Cryptocurrency Asset Tracker

A full-stack web application built with Next.js 14, TypeScript, Prisma, and NeonDB for tracking cryptocurrency assets in real-time.

**Built for Quantace Research Assessment**

## ✨ Features

- 📊 **Real-time Price Tracking** - View live cryptocurrency prices from CoinGecko API
- ⭐ **Favorites System** - Mark and filter your favorite crypto assets
- ➕ **Add Custom Assets** - Add any cryptocurrency with automatic price fetching
- 🔄 **Manual Price Refresh** - Update all prices on demand
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- 🌙 **Dark Mode Support** - Automatic dark/light theme based on system preferences

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: NeonDB (Postgres)
- **ORM**: Prisma
- **HTTP Client**: Axios
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- NeonDB account (free tier available at [neon.tech](https://neon.tech))
- Git

## 🚀 Local Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd cryptotrack
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
COINGECKO_API_URL="https://api.coingecko.com/api/v3/simple/price"
```

**To get your NeonDB connection string:**
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard
4. Paste it as the `DATABASE_URL` value

### 4. Initialize Database

```bash
# Push schema to database
npm run db:push

# Seed with initial 10 cryptocurrencies
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment on Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: CryptoTrack application"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your `cryptotrack` repository
4. Configure environment variables:
   - Add `DATABASE_URL` with your NeonDB connection string
   - Add `COINGECKO_API_URL` (optional, defaults to CoinGecko API)
5. Click "Deploy"

### 3. Run Database Migration

After deployment, run the following commands:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Run database push
vercel env pull .env.local
npx prisma db push

# Seed the database
npm run db:seed
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/assets` | Fetch all assets |
| `POST` | `/api/assets` | Add new asset (auto-fetch price) |
| `PATCH` | `/api/assets/[id]/favorite` | Toggle favorite status |
| `GET` | `/api/favorites` | Fetch all favorited assets |
| `GET` | `/api/update-prices` | Manually refresh all prices |

### Example API Responses

**GET /api/assets**
```json
[
  {
    "id": 1,
    "name": "Bitcoin",
    "symbol": "bitcoin",
    "price": 45000.50,
    "favorite": true,
    "createdAt": "2025-10-10T12:00:00.000Z",
    "updatedAt": "2025-10-10T12:00:00.000Z"
  }
]
```

**POST /api/assets**
```json
{
  "name": "Cardano",
  "symbol": "cardano"
}
```

Response:
```json
{
  "id": 11,
  "name": "Cardano",
  "symbol": "cardano",
  "price": 0.45,
  "favorite": false,
  "createdAt": "2025-10-10T12:00:00.000Z",
  "updatedAt": "2025-10-10T12:00:00.000Z"
}
```

## 📁 Project Structure

```
cryptotrack/
├── app/
│   ├── api/
│   │   ├── assets/
│   │   │   ├── [id]/
│   │   │   │   └── favorite/
│   │   │   │       └── route.ts
│   │   │   └── route.ts
│   │   ├── favorites/
│   │   │   └── route.ts
│   │   └── update-prices/
│   │       └── route.ts
│   ├── add/
│   │   └── page.tsx
│   ├── favorites/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AssetCard.tsx
│   ├── LoadingSpinner.tsx
│   └── Navbar.tsx
├── lib/
│   └── prisma.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## 🎯 Features Breakdown

### Dashboard (`/`)
- Displays all cryptocurrency assets
- Shows name, symbol, current price, and favorite status
- Click star icon to toggle favorites
- "Refresh Prices" button to update all prices from CoinGecko

### Add Asset (`/add`)
- Form to add new cryptocurrencies
- Auto-fetches current price from CoinGecko API
- Validates symbol against CoinGecko database
- Helpful tips for finding correct CoinGecko IDs

### Favorites (`/favorites`)
- Shows only assets marked as favorites
- Same card interface as dashboard
- Empty state with helpful message

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push Prisma schema to database
npm run db:seed      # Seed database with initial data
```

## 🌟 Bonus Features Implemented

- ✅ Responsive design for all screen sizes
- ✅ Dark mode support (automatic based on system preference)
- ✅ Loading states and error handling
- ✅ Beautiful gradient UI with Tailwind CSS
- ✅ Smooth animations and transitions

## 📝 Notes

- The application uses CoinGecko's free API (no API key required)
- Rate limits apply: ~10-50 requests/minute for free tier
- Prices are fetched on-demand and can be manually refreshed
- All cryptocurrency symbols must match CoinGecko IDs exactly

## 🐛 Troubleshooting

**Database connection issues:**
- Verify your `DATABASE_URL` is correct
- Ensure NeonDB project is active
- Check that SSL mode is enabled

**Price fetching fails:**
- Verify the symbol matches CoinGecko ID exactly
- Check CoinGecko API status
- Ensure you're not hitting rate limits

**Build errors:**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Regenerate Prisma client: `npx prisma generate`

## 📄 License

MIT License - Built for educational purposes

## 👨‍💻 Author

Built for Quantace Research Technical Assessment

---

**Live Demo**: [Your Vercel URL here]  
**GitHub**: [Your GitHub URL here]  
**Database**: NeonDB (Postgres)
# crypto
