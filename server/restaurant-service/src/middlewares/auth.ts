import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface CustomRequest extends Request {
  user?: { id: string; role: string; name: string };
}

export const authenticate = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY as Secret) as JwtPayload;
    console.log('Decoded token:', decoded);
    
    req.user = {
      id: decoded.user_id,
      role: decoded.role,
      name: decoded.name,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
};

export const verifyRole = (roles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Access denied: Insufficient permissions' });
      return;
    }

    next();
  };
};
