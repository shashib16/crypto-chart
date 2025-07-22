export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface UserRegistration {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserResponse extends Omit<User, 'password'> {}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  balance: number;
  currency: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Holding {
  id: string;
  portfolioId: string;
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice?: number;
  totalValue?: number;
  pnl?: number;
  pnlPercent?: number;
  createdAt: Date;
  updatedAt?: Date;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  portfolioId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
  quantity: number;
  price?: number;
  stopPrice?: number;
  status: 'PENDING' | 'FILLED' | 'CANCELLED' | 'REJECTED';
  executedQuantity: number;
  executedPrice?: number;
  fee?: number;
  createdAt: Date;
  updatedAt?: Date;
  executedAt?: Date;
}

export interface CreateOrderData {
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT';
  quantity: number;
  price?: number;
}

// Market Data Types
export interface MarketTicker {
  symbol: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  lastUpdate: Date;
}

export interface OrderBook {
  symbol: string;
  bids: [number, number][]; // [price, quantity]
  asks: [number, number][]; // [price, quantity]
  lastUpdate: Date;
}

// JWT Types
export interface JWTPayload {
  userId: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: any;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
  refreshToken: string;
}

// Request Extensions
export interface AuthenticatedRequest extends Request {
  user: User;
  token: string;
}

// Database Interface
export interface Database {
  users: Map<string, User>;
  portfolios: Map<string, Portfolio>;
  holdings: Map<string, Holding>;
  orders: Map<string, Order>;
  blacklistedTokens: Set<string>;
}

// Binance API Types
export interface BinanceTickerResponse {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
  volume: string;
  high: string;
  low: string;
}

export interface BinanceOrderBookResponse {
  lastUpdateId: number;
  bids: string[][];
  asks: string[][];
}

// WebSocket Message Types
export interface WebSocketMessage {
  type: 'PRICE_UPDATE' | 'ORDER_UPDATE' | 'PORTFOLIO_UPDATE';
  data: any;
  timestamp: Date;
}

