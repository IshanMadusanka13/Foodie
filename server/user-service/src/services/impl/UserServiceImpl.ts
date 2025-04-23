import { IUserService } from '../UserService';
import User, { IUser } from '../../models/User';
import bcrypt from 'bcrypt';
import logger from '../../config/logger';

export class UserService implements IUserService {
    
  async createUser(user: IUser): Promise<IUser> {
    logger.info('Creating new user');
    try {
      user.user_id = await this.generateUserId();
      user.password = await bcrypt.hash(user.password, 10);
      const newUser = new User(user);
      const savedUser = await newUser.save();
      logger.info('User created successfully');
      return savedUser;
    } catch (error) {
      logger.error({ error, email: user.email }, 'Failed to create user');
      throw error;
    }
  }

  async login(credentials: { email: string; password: string }): Promise<IUser | null> {
    logger.info('Attempting user login');
    try {
      const user = await User.findOne({ email: credentials.email });
      
      if (!user) {
        logger.warn('Login failed - user not found');
        return null;
      }
      
      const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
      
      if (isPasswordValid) {
        logger.info('Login successful');
        return user;
      } else {
        logger.warn('Login failed - invalid password');
        return null;
      }
    } catch (error) {
      logger.error({ error, email: credentials.email }, 'Error during login');
      throw error;
    }
}

  async getUserById(userId: string): Promise<IUser | null> {
    logger.info({ userId }, 'Fetching user by ID');
    try {
      const user = await User.findOne({ user_id: userId });
      if (user) {
        logger.info('User found');
      } else {
        logger.warn('User not found');
      }
      return user;
    } catch (error) {
      logger.error({ error, userId }, 'Error fetching user by ID');
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    logger.info({ email }, 'Fetching user by email');
    try {
      const user = await User.findOne({ email });
      if (user) {
        logger.info('User found');
      } else {
        logger.warn('User not found');
      }
      return user;
    } catch (error) {
      logger.error({ error, email }, 'Error fetching user by email');
      throw error;
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    logger.info('Fetching all users');
    try {
      const users = await User.find();
      logger.info('Users retrieved successfully');
      return users;
    } catch (error) {
      logger.error({ error }, 'Failed to fetch all users');
      throw error;
    }
  }

  async updateUser(userId: string, user: Partial<IUser>): Promise<IUser | null> {
    logger.info({ userId }, 'Updating user');
    try {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
        logger.debug('Password hashed for update');
      }
      const updatedUser = await User.findOneAndUpdate({ user_id: userId }, user, { new: true });
      if (updatedUser) {
        logger.info('User updated successfully');
      } else {
        logger.warn('User not found for update');
      }
      return updatedUser;
    } catch (error) {
      logger.error({ error, userId }, 'Failed to update user');
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    logger.info({ userId }, 'Deleting user');
    try {
      const result = await User.deleteOne({ user_id: userId });
      const isDeleted = result.deletedCount > 0;
      if (isDeleted) {
        logger.info('User deleted successfully');
      } else {
        logger.warn('User not found for deletion');
      }
      return isDeleted;
    } catch (error) {
      logger.error({ error, userId }, 'Failed to delete user');
      throw error;
    }
  }

  async generateUserId(): Promise<string> {
    logger.info('Generating new user ID');
    try {

      const count = await User.countDocuments();
      const nextSequence = count + 1;
      const formattedSequence = nextSequence.toString().padStart(4, '0');
      const userId = `F${formattedSequence}`;
      logger.debug('User ID generated');
      return userId;

    } catch (error) {
      logger.error({ error }, 'Failed to generate user ID');
      throw error;
    }
  }

}