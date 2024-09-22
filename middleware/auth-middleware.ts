import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export function authMiddleware(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      (req as any).userId = decoded.userId;

      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}