
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';
import prisma from '../lib/prisma';
import { ApiResponse } from '../types/api';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '24h';

export interface JWTPayload {
  userId: string;
  sessionId: string;
  type: 'access' | 'refresh';
}

export interface AuthenticatedRequest extends Request {
  user: User;
  sessionId: string;
}

// Generate JWT token with session
export const generateToken = async (userId: string): Promise<{ token: string; refreshToken: string; sessionId: string }> => {
  // Create session in database
  const session = await prisma.userSession.create({
    data: {
      userId,
      token: '', // Will update after token generation
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    }
  });

  const payload: JWTPayload = { 
    userId, 
    sessionId: session.id, 
    type: 'access' 
  };
  
  const refreshPayload: JWTPayload = { 
    userId, 
    sessionId: session.id, 
    type: 'refresh' 
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign(refreshPayload, JWT_SECRET, { expiresIn: '7d' });

  // Update session with tokens
  await prisma.userSession.update({
    where: { id: session.id },
    data: { 
      token, 
      refreshToken 
    }
  });

  return { token, refreshToken, sessionId: session.id };
};

// Verify token middleware
export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      const response: ApiResponse = {
        success: false,
        error: 'Access token required'
      };
      res.status(401).json(response);
      return;
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    // Check session in database
    const session = await prisma.userSession.findUnique({
      where: { 
        id: decoded.sessionId,
        token: token,
        isRevoked: false
      },
      include: {
        user: true
      }
    });

    if (!session) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid or expired session'
      };
      res.status(401).json(response);
      return;
    }

    // Check if session is expired
    if (session.expiresAt < new Date()) {
      const response: ApiResponse = {
        success: false,
        error: 'Session expired'
      };
      res.status(401).json(response);
      return;
    }

    // Update last used
    await prisma.userSession.update({
      where: { id: session.id },
      data: { lastUsedAt: new Date() }
    });

    // Attach user to request
    (req as AuthenticatedRequest).user = session.user;
    (req as AuthenticatedRequest).sessionId = session.id;
    
    next();

  } catch (error) {
    let errorMessage = 'Invalid token';
    if (error instanceof jwt.TokenExpiredError) {
      errorMessage = 'Token expired';
    }
    
    const response: ApiResponse = {
      success: false,
      error: errorMessage
    };
    res.status(401).json(response);
  }
};

// Logout function
export const logout = async (sessionId: string): Promise<void> => {
  await prisma.userSession.update({
    where: { id: sessionId },
    data: { isRevoked: true }
  });
};
