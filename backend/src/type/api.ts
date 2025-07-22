import { Request, Response } from 'express';

// User Types
export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  balance: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserResponse extends Omit<User, 'password'> {}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Authentication Types
export interface AuthenticatedRequest extends Request {
  user: User;
  token: string;
}

export interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

// Portfolio Types
export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  balance: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Holding {
  id: string;
  symbol: string;
  quantity: number;
  avgPrice: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface PortfolioWithHoldings extends Portfolio {
  holdings: Holding[];
  totalValue: number;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT';
  quantity: number;
  price?: number;
  status: 'PENDING' | 'FILLED' | 'CANCELLED' | 'REJECTED';
  createdAt: Date;
  filledAt?: Date;
  cancelledAt?: Date;
  executedPrice?: number;
}

export interface CreateOrderRequest {
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT';
  quantity: number;
  price?: number;
}

// Market Data Types
export interface MarketPrice {
  symbol: string;
  price: string;
}

export interface TickerData {
  symbol: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  timestamp: string;
}

export interface TopGainer {
  symbol: string;
  price: number;
  priceChangePercent: number;
  volume: number;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: any;
}

export interface AuthResponse {
  message: string;
  user: UserResponse;
  token: string;
}

// Binance API Types
export interface BinancePriceResponse {
  symbol: string;
  price: string;
}

export interface BinanceTicker24hrResponse {
  symbol: string;
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
  volume: string;
  highPrice: string;
  lowPrice: string;
}

