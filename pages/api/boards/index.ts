import type { NextApiRequest, NextApiResponse } from "next";
import UserModel from "@/database/data";
import connectMongo from "@/database/connectMongo";
import { authMiddleware } from "@/middleware/auth-middleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Connecting to MongoDB...');
  await connectMongo();
  console.log('Connected to MongoDB');

  const userId = (req as any).userId;

  try {
    if (req.method === "GET") {
      console.log('Fetching boards for user:', userId);
      const user = await UserModel.findById(userId);
      if (!user) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
      }
      console.log('Boards fetched successfully');
      res.status(200).json({ boards: user.boards });
    }

    if (req.method === "POST") {
      console.log('Creating new board for user:', userId);
      const user = await UserModel.findById(userId);
      if (!user) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
      }
      user.boards.push(req.body);
      await user.save();
      console.log('New board created successfully');
      res.status(201).json(req.body);
    }
  } catch (error) {
    console.error('Error in boards API:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default authMiddleware(handler);