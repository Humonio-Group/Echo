import type { ISimulator, ISimulatorCreate } from "~/types/simulators";
import prisma from "~/prisma";
import type { TArray, TNull } from "~/types/globals/utils";
import { EchoNotFoundError } from "~/types/globals/errors";

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

/**
 * Recover a public simulator template
 * @param {number} id - Unique id of the simulator template
 * @returns {ISimulator} - The recovered simulator
 * @throws {EchoNotFoundError} if the queried simulator is not found
 */
export async function get(id: number): Promise<ISimulator> {
  const simulator = await prisma.simulator.findUnique({
    where: {
      id,
      workspaceId: null,
    },
    include: {
      prepQuestions: true,
      evaluations: true,
    },
  });
  if (!simulator) throw new EchoNotFoundError("Simulator not found");
  return simulator;
}
