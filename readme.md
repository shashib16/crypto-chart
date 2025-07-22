# Crypto Analytics Dashboard

A modern, real-time cryptocurrency tracking dashboard built with a powerful full-stack architecture.

## Project Overview

This project is a comprehensive cryptocurrency analytics platform that provides real-time price tracking, interactive charts, and detailed market analysis. It features a responsive design with dark/light mode support and live data updates.

## Tech Stack

### Frontend
- Next.js 13 (App Router)
- React with TypeScript
- Redux for state management
- TailwindCSS for styling
- D3.js for data visualization
- WebSocket for real-time updates

### Backend
- Node.js with TypeScript
- Prisma as ORM
- RESTful API architecture
- WebSocket server for real-time data
- Environment configuration with dotenv

## Key Features

- Real-time cryptocurrency price tracking
- Interactive charts with multiple timeframes (1M, 5M, 15M, 1H, 4H, 1D)
- Dark/Light mode support
- Responsive design for all devices
- Live price updates with WebSocket
- Historical data visualization
- Price change indicators with visual feedback
- Market metrics and analysis tools

## Project Structure

```
├── frontend/           # Next.js frontend application
│   ├── src/
│   ├── public/
│   └── components/
└── backend/           # Node.js backend server
    ├── src/
    ├── prisma/
    └── config/
```

## Getting Started

1. Clone the repository
2. Install dependencies for both frontend and backend
3. Set up environment variables
4. Run the development servers

For detailed setup instructions, see the README files in frontend and backend directories.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details

## How to Use

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/crypto-analytics-dashboard.git
   cd crypto-analytics-dashboard
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env    # Create and configure your environment variables
   npm run dev            # Starts the development server on port 5000
   ```

3. **Set up the Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env    # Create and configure your environment variables
   npm run dev            # Starts the development server on port 3000
   ```

### Using the Dashboard

1. **Authentication**
   - Register for a new account or login with existing credentials
   - JWT authentication is used for secure access

2. **Main Dashboard**
   - View real-time cryptocurrency prices
   - Toggle between different timeframes using the chart controls
   - Switch between dark/light modes using the theme toggle

3. **Chart Features**
   - Click on any point in the chart to see detailed price information
   - Use the timeframe selector (1M, 5M, 15M, 1H, 4H, 1D) to adjust the view
   - Zoom in/out using mouse wheel or pinch gestures

4. **Market Analysis**
   - View key market metrics in the analysis panel
   - Track price changes with visual indicators
   - Monitor historical price trends

### API Integration

To integrate with our API, use the following base URL:
```
http://localhost:5000/api/v1
```

Key endpoints:
- `/auth` - Authentication endpoints
- `/crypto` - Cryptocurrency data endpoints
- `/market` - Market analysis endpoints
