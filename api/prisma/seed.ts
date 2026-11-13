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
    title: 'Pay electricity bill',
    description: 'Due at the end of the week, pay online.',
    status: TaskStatus.DONE,
    dueDate: daysFromNow(-3),
  },
  {
    title: 'Book dentist appointment',
    description: 'Call the clinic and ask for a morning slot.',
    status: TaskStatus.TODO,
    dueDate: daysFromNow(-1),
  },
  {
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, rice and vegetables.',
    status: TaskStatus.IN_PROGRESS,
    dueDate: daysFromNow(1),
  },
  {
    title: 'Prepare weekly team report',
    description: 'Summarise progress and send it to the manager.',
    status: TaskStatus.IN_PROGRESS,
    dueDate: daysFromNow(3),
  },
  {
    title: 'Renew car insurance',
    description: null,
    status: TaskStatus.TODO,
    dueDate: daysFromNow(10),
  },
  {
    title: 'Plan weekend trip',
    description: 'Pick a place and check the weather.',
    status: TaskStatus.TODO,
    dueDate: null,
  },
  {
    title: 'Call mum',
    description: 'Catch up and ask about the family dinner.',
    status: TaskStatus.DONE,
    dueDate: daysFromNow(-6),
  },
  {
    title: 'Clean the kitchen',
    description: 'Wipe the counters and take out the rubbish.',
    status: TaskStatus.DONE,
    dueDate: daysFromNow(-2),
  },
  {
    title: 'Water the plants',
    description: null,
    status: TaskStatus.TODO,
    dueDate: daysFromNow(0),
  },
  {
    title: 'Fix the leaking tap',
    description: 'Buy a new washer and replace it.',
    status: TaskStatus.IN_PROGRESS,
    dueDate: daysFromNow(4),
  },
  {
    title: 'Pick up the parcel',
    description: 'Collect it from the post office before it closes.',
    status: TaskStatus.TODO,
    dueDate: daysFromNow(6),
  },
  {
    title: 'Update my CV',
    description: 'Add the latest project and check for typos.',
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
