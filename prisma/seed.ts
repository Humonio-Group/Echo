import { PrismaClient } from "@prisma/client";
import seedSimulators from "./seeds/simulators";

const client = new PrismaClient();

async function main() {
  await seedSimulators(client);
}

main()
  .then(() => client.$disconnect())
  .catch(() => {
    client.$disconnect();
    process.exit(1);
  });
