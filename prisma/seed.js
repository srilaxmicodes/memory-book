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
  const sharedPassword = "sree";
  await upsertUser("couple", "Sree & Dhanush", sharedPassword);
  await upsertUser("sree", "Sree", sharedPassword);
  await upsertUser("dhanush", "Dhanush", sharedPassword);
  console.log("Seeded couple, Sree, and Dhanush accounts. No sample memories were created.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
