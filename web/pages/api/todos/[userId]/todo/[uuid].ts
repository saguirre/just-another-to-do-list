import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function userHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      query: { userId },
      method,
    } = req;

    console.log('userId in routes:', userId);
    switch (method) {
      case 'GET':
        const user = await prisma.users.findFirst({ where: { id: `${userId}` } });
        console.log('user in routes:', user);
        res.status(200).json(user);
        break;
      case 'PUT':
        // Update or create data in your database
        res.status(200);
        break;
      default:
        res.setHeader('Allow', ['GET', 'PUT']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
