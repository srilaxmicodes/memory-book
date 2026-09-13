const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function upsertUser(username, displayName, password) {
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { username },
    update: { displayName, passwordHash },
    create: { username, displayName, passwordHash },
  });
}

async function main() {
  const sreePassword = process.env.SREE_PASSWORD || "sree123";
  const dhanushPassword = process.env.DHANUSH_PASSWORD || "dhanush123";
  await upsertUser("sree", "Sree", sreePassword);
  await upsertUser("dhanush", "Dhanush", dhanushPassword);
  console.log("Seeded Sree and Dhanush. No sample memories were created.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
