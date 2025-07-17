import type { PrismaClient } from "@prisma/client";
import type { ISimulatorCreate } from "~/types/simulators";

const data: (ISimulatorCreate & { id: number })[] = [
  {
    id: 1,
    title: "ROPE Communicant",
    description: "Communique suivant le framework ROPE.",
    picture: null,
    duration: 15,
    behaviorPrompt: "Prompt de comportement",
    prepQuestions: [
      {
        id: 1,
        label: "Quel est ton nom ?",
      },
      {
        id: 2,
        label: "Quel est ton prénom ?",
      },
    ],
    evaluations: [
      {
        id: 1,
        frameworkPrompt: "framework prompt",
        assessmentPrompt: "assessment prompt",
        feedbackPrompt: "feedback prompt",
      },
    ],
  },
];

export default async function (client: PrismaClient) {
  for (const el of data) {
    try {
      await client.simulator.upsert({
        where: {
          id: el.id,
        },
        create: {
          ...el,
          createdBy: "system",
          prepQuestions: {
            createMany: {
              data: el.prepQuestions ?? [],
            },
          },
          evaluations: {
            createMany: {
              data: el.evaluations ?? [],
            },
          },
        },
        update: {
          ...el,
          prepQuestions: {},
          evaluations: {},
        },
      });
    }
    catch (e) {
      console.error(e);
    }
  }
}
