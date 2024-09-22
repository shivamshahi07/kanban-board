import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectMongo from '../../database/connectMongo';
import UserModel from '../../database/data';
import fs from 'fs';
import path from 'path';

const initialBoards = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'data.json'), 'utf-8'));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Connecting to MongoDB...');
  await connectMongo();
  console.log('Connected to MongoDB');

  if (req.method === 'POST') {
    if (req.body.action === 'signup') {
      const { email, password } = req.body;

      console.log('Checking if user exists...');
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        console.log('User already exists');
        return res.status(400).json({ message: 'User already exists' });
      }

      console.log('Creating new user...');
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.create({ 
        email, 
        password: hashedPassword,
        boards: initialBoards.boards
      });
      console.log('User created successfully');

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

      return res.status(201).json({ token });
    } else if (req.body.action === 'login') {
      const { email, password } = req.body;

      console.log('Finding user...');
      const user = await UserModel.findOne({ email });
      if (!user) {
        console.log('User not found');
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      console.log('Validating password...');
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log('Invalid password');
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      console.log('Login successful');
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

      return res.status(200).json({ token });
    }
  }

  res.status(405).json({ message: 'Method not allowed' });
}