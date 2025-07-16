import type { ISimulator, ISimulatorCreate } from "~/types/simulators";
import prisma from "~/prisma";
import type { TArray, TNull } from "~/types/globals/utils";

/**
 * Create a simulator
 * @param {string} userId - Clerk client issuer id
 * @param {TNull<number>} workspaceId - Current working workspace id
 * @param {ISimulatorCreate} data - Provided data
 * @returns {ISimulator} - The created simulator info
 */
export async function create(userId: string, workspaceId: TNull<number>, data: ISimulatorCreate): Promise<ISimulator> {
  return prisma.simulator.create({
    data: {
      ...data,
      workspaceId,
      createdBy: userId,
      prepQuestions: {
        createMany: {
          data: data.prepQuestions ?? [],
        },
      },
      evaluations: {
        createMany: {
          data: data.evaluations ?? [],
        },
      },
    },
    include: {
      prepQuestions: true,
      evaluations: true,
    },
  });
}

/**
 * Recover all simulators for a workspace (and public lib)
 * @param {number} workspaceId - Current issuer workspace id
 * @returns {TArray<ISimulator>} - The list of the recovered simulators
 */
export async function getAll(workspaceId: number): Promise<TArray<ISimulator>> {
  return prisma.simulator.findMany({
    where: {
      OR: [
        {
          workspaceId,
        },
        {
          workspaceId: null,
        },
      ],
    },
    include: {
      prepQuestions: true,
      evaluations: true,
    },
  });
}
