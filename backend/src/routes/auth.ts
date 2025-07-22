import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// In-memory user storage (replace with database later)
const users = new Map();
const blacklistedTokens = new Set();

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to generate JWT
const generateToken = (userId : string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};

// Authentication middleware
const authenticateToken = (req : Request, res : Response, next : NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  if (blacklistedTokens.has(token)) {
    return res.status(401).json({ error: 'Token has been revoked' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded : any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    const user = users.get(decoded?.userId || '');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
    return;
  });
  return res.status(500).json({ error: 'Internal server error' });
};

// REGISTER
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 })
], async (req :Request, res : Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { email, password, firstName, lastName } = req.body;

    // Check if user exists
    for (const user of users.values()) {
      if (user.email === email) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userId = Date.now().toString();
    const user = {
      id: userId,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      createdAt: new Date(),
      balance: 10000 // Demo balance
    };

    users.set(userId, user);

    // Generate token
    const token = generateToken(userId);

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        balance: user.balance
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

// LOGIN
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req : Request, res : Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    let user = null;
    for (const u of users.values()) {
      if (u.email === email) {
        user = u;
        break;
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);

    return res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        balance: user.balance
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
});

// LOGOUT
router.post('/logout', authenticateToken, (req : Request, res : Response) => {
  blacklistedTokens.add(req.token);
  res.json({ message: 'Logout successful' });
});

// GET PROFILE
router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      balance: req.user.balance,
      createdAt: req.user.createdAt
    }
  });
});

// Export middleware for other routes
module.exports = router;
module.exports.authenticateToken = authenticateToken;

