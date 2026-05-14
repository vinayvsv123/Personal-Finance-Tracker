import type { Request, Response } from 'express';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { registerUserSchema, loginUserSchema } from '../validators/user.validator.js';
import type { AuthRequest } from '../middleware/authmiddleware.js';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedData = registerUserSchema.parse(req.body);

    const existingUser = await User.findOne({
      $or: [{ email: parsedData.email }, { username: parsedData.username }]
    });

    if (existingUser) {
      res.status(400).json({ message: 'User with this email or username already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(parsedData.password, salt);

    const newUser = new User({
      username: parsedData.username,
      email: parsedData.email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error: any) {
    res.status(400).json({ message: 'Validation error or server error', error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedData = loginUserSchema.parse(req.body);

    const user = await User.findOne({ email: parsedData.email });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(parsedData.password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error: any) {
    res.status(400).json({ message: 'Validation error or server error', error: error.message });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
