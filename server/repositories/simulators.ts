import type {
  IEvaluationCreate, IEvaluationUpdate,
  IPrepQuestionCreate,
  IPrepQuestionUpdate,
  ISimulator,
  ISimulatorCreate, ISimulatorUpdate,
} from "~/types/simulators";
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

export async function update(id: number, data: ISimulatorUpdate): Promise<ISimulator> {
  return prisma.simulator.update({
    where: {
      id,
    },
    data: {
      title: data.title,
      description: data.description,
      duration: data.duration,
      picture: data.picture,
      behaviorPrompt: data.behaviorPrompt,
    },
    include: {
      prepQuestions: true,
      evaluations: true,
    },
  });
}

export async function destroy(id: number): Promise<ISimulator> {
  return prisma.simulator.delete({
    where: {
      id,
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
      workspaceId,
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
 * @param {number | undefined} workspaceId - Targeted workspace id
 * @returns {ISimulator} - The recovered simulator
 * @throws {EchoNotFoundError} if the queried simulator is not found
 */
export async function get(id: number, workspaceId?: number): Promise<ISimulator> {
  const simulator = await prisma.simulator.findUnique({
    where: {
      id,
      workspaceId: workspaceId ?? null,
    },
    include: {
      prepQuestions: true,
      evaluations: true,
    },
  });
  if (!simulator) throw new EchoNotFoundError("Simulator not found");
  return simulator;
}

/**
 * Get the public simulators (non workspace specific)
 * @returns {TArray<ISimulator>} - the recovered simulators library
 */
export async function getPublicLibrary(): Promise<TArray<ISimulator>> {
  return prisma.simulator.findMany({
    where: {
      workspaceId: null,
    },
    include: {
      prepQuestions: true,
      evaluations: true,
    },
  });
}

export async function createQuestion(simulatorId: number, data: IPrepQuestionCreate) {
  return prisma.prepQuestion.create({
    data: {
      simulatorId,
      label: data.label,
    },
  });
}

export async function updateQuestion(key: string, data: IPrepQuestionUpdate) {
  return prisma.prepQuestion.update({
    where: {
      key,
    },
    data: {
      label: data.label,
    },
  });
}

export async function deleteQuestion(key: string) {
  return prisma.prepQuestion.delete({
    where: {
      key,
    },
  });
}

export async function createEvaluation(simulatorId: number, data: IEvaluationCreate) {
  return prisma.evaluation.create({
    data: {
      simulatorId,
      frameworkPrompt: data.frameworkPrompt,
      assessmentPrompt: data.assessmentPrompt,
      feedbackPrompt: data.feedbackPrompt,
    },
  });
}

export async function updateEvaluation(key: string, data: IEvaluationUpdate) {
  return prisma.evaluation.update({
    where: {
      key,
    },
    data: {
      frameworkPrompt: data.frameworkPrompt,
      assessmentPrompt: data.assessmentPrompt,
      feedbackPrompt: data.feedbackPrompt,
    },
  });
}

export async function deleteEvaluation(key: string) {
  return prisma.evaluation.delete({
    where: {
      key,
    },
  });
}
