import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: any;   // Replace 'any' with your user type if you have one
    token?: string;
  }
  interface Response {
    locals?: {
      user?: any; // Replace 'any' with your user type if you have one
    };
  }
  interface NextFunction {
    (err?: any): void; // Allow next to accept an error 
  }
}