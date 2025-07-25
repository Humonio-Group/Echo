import type {
  IConversation,
  IMessage,
  IPrepAnswerCreate,
} from "~/types/conversations";
import prisma from "~/prisma";
import type { ISimulator } from "~/types/simulators";
import { EchoNotFoundError } from "~/types/globals/errors";
import type { TArray } from "~/types/globals/utils";

/**
 * Create a conversation with pre-filled prep answers
 * @param {string} userId - ID of user who starts the conversation
 * @param {number} workspaceId - Workspace in which the conversation takes place
 * @param {ISimulator} simulator - Simulator which will be used for assessments
 * @param {IPrepAnswerCreate} answers - Pre-filled prep answers
 * @returns {IConversation} - The created conversation with rich data
 */
export async function create(userId: string, workspaceId: number, simulator: ISimulator, answers: IPrepAnswerCreate[]): Promise<IConversation> {
  return prisma.conversation.create({
    data: {
      simulatorId: simulator.id,
      name: simulator.title,
      userId,
      workspaceId,
      stoppedAt: new Date(Date.now() + simulator.duration * 1000 * 60),
      answers: {
        createMany: {
          data: [
            ...answers,
          ],
        },
      },
    },
    include: {
      answers: true,
      messages: true,
      assessments: true,
    },
  });
}

/**
 * Store a message sent by user or generate by AI
 * @param {string} conversationUid - Conversation who the message takes his place
 * @param {string} sender - ID of user who sent the message (AI if generate)
 * @param {string} message - Message content
 * @returns {IMessage} - The stored message entity
 * @throws {EchoNotFoundError} if the targeted conversation remains not found
 */
export async function message(conversationUid: string, sender: string, message: string): Promise<IMessage> {
  if (!await exists(conversationUid)) throw new EchoNotFoundError("Conversation not found!");
  return prisma.message.create({
    data: {
      conversationUid,
      sender,
      content: message,
    },
  });
}

/**
 * Recover a conversation's data
 * @param {string} uid - Uid of the targeted conversation
 * @returns {IConversation} - The conversation entity with rich data
 * @throws {EchoNotFoundError} if the targeted conversation remains not found
 */
export async function get(uid: string): Promise<IConversation> {
  const conv = await prisma.conversation.findUnique({
    where: {
      uid,
    },
    include: {
      answers: true,
      messages: true,
      assessments: true,
      simulator: {
        include: {
          evaluations: true,
          prepQuestions: true,
        },
      },
      workspace: true,
    },
  });
  if (!conv) throw new EchoNotFoundError("Conversation not found!");
  return conv;
}

/**
 * Check if the targeted conversation exists
 * @param {string} uid - Targeted conversation uid
 * @returns {boolean} - state of existence
 */
export async function exists(uid: string): Promise<boolean> {
  return !!await prisma.conversation.findUnique({
    where: {
      uid,
    },
    include: {
      answers: true,
      messages: true,
      assessments: true,
    },
  });
}

/**
 * Recover all user's conversations from a dedicated workspace
 * @param {string} userId - User id (clerk id)
 * @param {number} workspaceId - Workspace id
 * @returns {TArray<IConversation>} - the list of the recovered conversations
 */
export async function getAll(userId: string, workspaceId: number): Promise<TArray<IConversation>> {
  return prisma.conversation.findMany({
    where: {
      userId,
      workspaceId,
    },
    orderBy: [
      {
        startedAt: "desc",
      },
      {
        stoppedAt: "desc",
      },
    ],
    include: {
      simulator: true,
      messages: true,
      assessments: true,
      answers: true,
    },
  });
}

/**
 * Update an existing conversation to stop it at the given date
 * @param {string} uid - Targeted conversation uid
 * @param {Date} endDate - Date to stop the conversation at
 * @returns {IConversation} - the updated conversation
 * @throws {EchoNotFoundError} if the given uid doesn't belong to any active conversation
 */
export async function end(uid: string, endDate: Date): Promise<IConversation> {
  if (!await exists(uid)) throw new EchoNotFoundError("Conversation not found!");
  return prisma.conversation.update({
    where: {
      uid,
      stoppedAt: {
        gt: endDate,
      },
    },
    data: {
      stoppedAt: endDate,
    },
    include: {
      answers: true,
      messages: true,
      assessments: true,
      simulator: {
        include: {
          evaluations: true,
          prepQuestions: true,
        },
      },
      workspace: true,
    },
  });
}
