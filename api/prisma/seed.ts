import { PrismaClient, TaskStatus } from '@prisma/client';

const prisma = new PrismaClient();

const daysFromNow = (days: number) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

const sampleTasks = [
  {
    title: 'Set up the project',
    description: 'Create the repo and install dependencies.',
    status: TaskStatus.DONE,
    dueDate: daysFromNow(-5),
  },
  {
    title: 'Build the tasks API',
    description: 'CRUD endpoints with validation and error handling.',
    status: TaskStatus.DONE,
    dueDate: daysFromNow(-2),
  },
  {
    title: 'Design the task table',
    description: 'Show tasks in a table with status badges.',
    status: TaskStatus.IN_PROGRESS,
    dueDate: daysFromNow(2),
  },
  {
    title: 'Write the README',
    description: 'Setup steps, env variables and how I used AI.',
    status: TaskStatus.IN_PROGRESS,
    dueDate: daysFromNow(5),
  },
  {
    title: 'Add Docker Compose',
    description: null,
    status: TaskStatus.TODO,
    dueDate: daysFromNow(7),
  },
  {
    title: 'Prepare for the interview',
    description: 'Be ready to explain every part of the code.',
    status: TaskStatus.TODO,
    dueDate: null,
  },
];

async function main() {
  // Do nothing if there is already data, so real tasks are never touched
  const count = await prisma.task.count();
  if (count > 0) {
    console.log(`Skipped: the database already has ${count} task(s).`);
    return;
  }

  await prisma.task.createMany({ data: sampleTasks });
  console.log(`Seeded ${sampleTasks.length} sample tasks.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
