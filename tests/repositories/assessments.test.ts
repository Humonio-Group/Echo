// __tests__/repositories/assessments.test.ts

import type { EAssessmentType } from "~/types/conversations";

vi.mock("~/prisma", () => ({
  default: {
    assessment: {
      create: vi.fn(),
    },
  },
}));

import * as assessments from "~/server/repositories/assessments";
import prisma from "~/prisma";

describe("assessmentRepository.create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create an assessment linked to a conversation", async () => {
    const mockConversationUid = "conv-123";
    const mockAssessmentData = {
      evaluationKey: "assertiveness",
      type: "text" as EAssessmentType,
      data: JSON.stringify({ score: 4 }),
      debrief: "Bonne posture globale",
    };

    const expectedAssessment = {
      id: 1,
      conversationUid: mockConversationUid,
      evaluationKey: "assertiveness",
      type: "text",
      data: JSON.stringify({ score: 4 }),
      debrief: "Bonne posture globale",
      createdAt: new Date(),
      conversation: {
        uid: mockConversationUid,
        userId: "user-456",
        workspaceId: 99,
        simulatorId: 2,
      },
      evaluation: {
        id: 3,
        key: "assertiveness",
        title: "Assertiveness",
        description: "Capacité à s'exprimer avec assurance",
      },
    };

    (prisma.assessment.create as any).mockResolvedValue(expectedAssessment);

    const result = await assessments.create(mockConversationUid, mockAssessmentData);

    expect(prisma.assessment.create).toHaveBeenCalledWith({
      data: {
        ...mockAssessmentData,
        conversationUid: mockConversationUid,
      },
      include: {
        conversation: true,
        evaluation: true,
      },
    });

    expect(result).toEqual(expectedAssessment);
  });
});
