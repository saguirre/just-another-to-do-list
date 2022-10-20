import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function userHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      query: { userUuid },
      method,
    } = req;

    switch (method) {
      case 'GET':
        const userTags = await prisma.tags.findMany({
          where: { user: { uuid: `${userUuid}` } },
        });
        await prisma.$disconnect();
        res.status(200).json(userTags);
        break;

      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
