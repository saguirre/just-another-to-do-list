import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Todo } from '../../../../common/models/todo';
import { Tag } from '../../../../common/models/tag';
const prisma = new PrismaClient();

export default async function userHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      query: { userUuid },
      method,
    } = req;

    switch (method) {
      case 'GET':
        const todos = await prisma.todos.findMany({
          where: { user: { uuid: `${userUuid}` } },
          include: { todoTags: { select: { tag: true } } },
        });
        await prisma.$disconnect();
        res.status(200).json(todos);
        break;
      case 'POST':
        const body: { todo: any; tags?: Tag[] } = req.body;
        const { todo, tags } = body;
        let { projectId, ...data } = todo;
        if (!projectId) {
          const baseProject = await prisma.projects.findFirst({ where: { name: 'base_project' } });
          projectId = baseProject?.id;
        }
        let newTodo = await prisma.todos.create({
          data: {
            ...data,
            project: { connect: { id: Number(projectId) } },
            user: { connect: { uuid: `${userUuid}` } },
          },
        });
        if (tags && tags.length > 0) {
          const createdTags = await prisma.$transaction(
            tags.map((tag) =>
              prisma.tags.upsert({
                create: { name: tag.name, user: { connect: { uuid: `${userUuid}` } } },
                update: {},
                where: { name_userId: { name: tag.name, userId: `${userUuid}` } },
              })
            )
          );

          await prisma.todoTags.createMany({
            data: createdTags?.map(({ id }) => ({
              tagId: id,
              todoId: newTodo.id,
            })),
          });
        }
        newTodo = await prisma.todos.findUnique({
          where: { id: newTodo.id },
          include: { todoTags: { select: { tag: true } } },
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
