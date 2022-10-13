import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { withApiAuth } from '@supabase/auth-helpers-nextjs';

const prisma = new PrismaClient();

export default withApiAuth(async function userHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      query: { todoUuid },
      method,
    } = req;

    switch (method) {
      case 'GET':
        const todos = await prisma.todos.findUnique({ where: { id: `${todoUuid}` } });
        res.status(200).json(todos);
        break;
      case 'PUT':
        const updatedTodo = await prisma.todos.upsert({
          where: { id: `${todoUuid}` },
          create: { ...req.body },
          update: { ...req.body },
        });
        res.status(200).json(updatedTodo);
        break;
      case 'DELETE':
        const deletedTodo = await prisma.todos.update({ where: { id: `${todoUuid}` }, data: { deleted: true } });
        res.status(200).json(deletedTodo);
        break;
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
