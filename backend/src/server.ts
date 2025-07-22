import express, { NextFunction, Request, Response } from "express";
require('dotenv').config(); 
const app = express();
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const marketRouter = require('./routes/market');
const portfolioRouter = require('./routes/portfolio');
const orderRouter = require('./routes/orders');
const tradeRouter = require('./routes/trades');
const walletRouter = require('./routes/wallet');
const adminRouter = require('./routes/admin');
const notificationRouter = require('./routes/notifications');
const analyticsRouter = require('./routes/analytics');

const PORT = process.env.PORT;
console.log({ PORT })

app.use(express.json());

if(!PORT){
console.error('Error: PORT is not defined in environment variables. Please set the PORT variable in your .env file.');
process.exit(1);
}

app.get('/health', (req : any, res : any) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Mount routers
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/market', marketRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/orders', orderRouter);
app.use('/api/trades', tradeRouter);
app.use('/api/wallet', walletRouter);

app.get('/api', (req : any, res :any) => {
  res.json({
    message: 'Crypto Trading Platform API',
    version: '1.0.0',
    endpoints: {
      '/api/auth/*': 'Authentication',
      '/api/user/*': 'User management',
      '/api/market/*': 'Market data',
      '/api/portfolio/*': 'Portfolio management',
      '/api/orders/*': 'Order management',
      '/api/trades/*': 'Trade history',
      '/api/wallet/*': 'Wallet operations'
    }
  });
});


app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Error handler
app.use((err :Error, req : Request, res : Response, next : NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Crypto Trading API running on http://localhost:${PORT}`);
  console.log(`📖 API docs: http://localhost:${PORT}/api`);
});

/*
WHAT IS EXPRESS?
================
Express is a web framework for Node.js that makes it easy to:
- Create web servers
- Handle HTTP requests (GET, POST, PUT, DELETE)
- Send responses back to clients
- Add middleware for additional features

WHAT IS A ROUTE?
================
A route defines what happens when someone visits a specific URL:
- app.get('/path', function) - Handles GET requests to /path
- app.post('/path', function) - Handles POST requests to /path
- req = request (what the client sent)
- res = response (what we send back)

WHAT IS MIDDLEWARE?
===================
Middleware are functions that run between the request and response:
- app.use(express.json()) - Parses JSON from request body
- They can modify the request/response or add functionality

WHAT IS JSON?
=============
JSON (JavaScript Object Notation) is how data is exchanged:
{
  "message": "Hello",
  "data": {
    "name": "John",
    "age": 30
  }
}

HOW TO TEST THE SERVER:
=======================

1. Install dependencies:
   npm install express nodemon

2. Start the server:
   npm run dev

3. Test in browser:
   - Go to http://localhost:3000
   - Go to http://localhost:3000/health
   - Go to http://localhost:3000/api/test

4. Test with curl (command line):
   curl http://localhost:3000/health
   
   curl -X POST http://localhost:3000/api/echo \
     -H "Content-Type: application/json" \
     -d '{"name": "John", "message": "Hello"}'

5. Test with Postman:
   - Create GET request to http://localhost:3000/api/test
   - Create POST request to http://localhost:3000/api/echo
   - Add JSON body: {"test": "data"}

NEXT STEPS:
===========
Once you understand this basic server, we can add:
- Authentication (login/register)
- Database connection
- Security middleware
- Market data routes
- Real-time WebSocket connections
*/