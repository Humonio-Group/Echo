import type { IConversation, IMessage, IPrepAnswerCreate } from "~/types/conversations";
import prisma from "~/prisma";
import type { ISimulator } from "~/types/simulators";
import { EchoNotFoundError } from "~/types/globals/errors";

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
