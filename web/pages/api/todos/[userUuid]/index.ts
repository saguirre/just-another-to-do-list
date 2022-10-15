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
        const todos = await prisma.todos.findMany({ where: { user: { uuid: `${userUuid}` } } });
        await prisma.$disconnect();
        res.status(200).json(todos);
        break;
      case 'POST':
        const body = req.body;
        let { projectId, ...data } = body;
        if (!projectId) {
          const baseProject = await prisma.projects.findFirst({ where: { name: 'base_project' } });
          projectId = baseProject?.id;
        }
        const newTodo = await prisma.todos.create({
          data: { ...data, project: { connect: { id: Number(projectId) } }, user: { connect: { uuid: `${userUuid}` } } },
        });
        await prisma.$disconnect();
        res.status(200).json(newTodo);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
