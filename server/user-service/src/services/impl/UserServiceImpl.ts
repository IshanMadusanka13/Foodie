import { IUserService } from '../UserService';
import User, { IUser } from '../../models/User';
import bcrypt from 'bcrypt';

export class UserService implements IUserService {
    
  async createUser(user: IUser): Promise<IUser> {
    user.password = await bcrypt.hash(user.password, 10);
    const newUser = new User(user);
    return await newUser.save();
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return await User.findOne({ user_id: userId });
  }

  async getAllUsers(): Promise<IUser[]> {
    return await User.find();
  }

  async updateUser(userId: string, user: Partial<IUser>): Promise<IUser | null> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    return await User.findOneAndUpdate({ user_id: userId }, user, { new: true });
  }

  async deleteUser(userId: string): Promise<boolean> {
    const result = await User.deleteOne({ user_id: userId });
    return result.deletedCount > 0;
  }
}
