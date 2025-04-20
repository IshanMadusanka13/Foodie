import { Request, Response } from 'express';
import { UserService } from '../services/impl/UserServiceImpl';
import jwt, { JwtPayload } from 'jsonwebtoken';

const userService = new UserService();

export class UserController {
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await userService.login(req.body);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.json(user);
      }
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body);
      if (!updatedUser) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.json(updatedUser);
      }
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const deleted = await userService.deleteUser(req.params.id);
      if (!deleted) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.json({ message: 'User deleted successfully' });
      }
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  };

  verifyToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.header('Authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Missing or malformed Authorization header:', authHeader);
        res.status(401).json({ message: 'No token provided' });
        return;
      }

      const token = authHeader.replace('Bearer ', '').trim();
      console.log('Token received:', token);

      const decoded = jwt.verify(token, process.env.JWT_KEY!) as JwtPayload;
      console.log('Decoded token:', decoded);

      const userId = decoded?.user_id;
      if (!userId) {
        console.log('Token missing user_id');
        res.status(401).json({ message: 'Invalid token payload' });
        return;
      }

      const user = await userService.getUserById(userId);
      if (!user) {
        console.log('User not found for ID:', userId);
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.json({ id: user.user_id, role: user.role, name: user.name });

    } catch (err) {
      console.error('JWT Verify Error:', err);
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
}