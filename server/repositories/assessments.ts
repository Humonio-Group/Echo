import type { IAssessment, IAssessmentCreate } from "~/types/conversations";
import prisma from "~/prisma";

/**
 * Create an assessment for a specific conversation
 * @param {string} conversationUid - Target conversation uid
 * @param {IAssessmentCreate} data - Data to create the entity
 * @returns {IAssessment} - the created assessment with rich relations
 */
export async function create(conversationUid: string, data: IAssessmentCreate): Promise<IAssessment> {
  return prisma.assessment.create({
    data: {
      ...data,
      conversationUid,
    },
    include: {
      conversation: true,
      evaluation: true,
    },
  });
}
