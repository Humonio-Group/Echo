// __tests__/repositories/conversations.test.ts
vi.mock("~/prisma", () => ({
  default: {
    conversation: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    message: {
      create: vi.fn(),
    },
  },
}));

import * as conversations from "~/server/repositories/conversations";
import prisma from "~/prisma";
import { EchoNotFoundError } from "~/types/globals/errors";

describe("conversationRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("should create a conversation with prep answers", async () => {
      const mockSimulator = {
        id: 1,
        title: "Sim Test",
        description: "Test description",
        duration: 30,
        picture: null,
        behaviorPrompt: "Be friendly",
        createdBy: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
        workspaceId: null,
        workspace: null,
        prepQuestions: [],
        evaluations: [],
      };

      const mockAnswers = [
        { prepQuestionKey: "co1", answer: "Réponse 1" },
        { prepQuestionKey: "co2", answer: "Réponse 2" },
      ];

      const expectedConversation = {
        id: 1,
        simulatorId: 1,
        name: "Sim Test",
        userId: "user123",
        workspaceId: 42,
        stoppedAt: new Date(),
        answers: mockAnswers,
        messages: [],
        assessments: [],
      };

      (prisma.conversation.create as any).mockResolvedValue(expectedConversation);

      const result = await conversations.create("user123", 42, mockSimulator, mockAnswers);

      expect(prisma.conversation.create).toHaveBeenCalledWith({
        data: {
          simulatorId: 1,
          name: "Sim Test",
          userId: "user123",
          workspaceId: 42,
          stoppedAt: expect.any(Date),
          answers: {
            createMany: {
              data: mockAnswers,
            },
          },
        },
        include: {
          answers: true,
          messages: true,
          assessments: true,
        },
      });

      expect(result).toEqual(expectedConversation);
    });
  });

  describe("message", () => {
    it("should throw if the conversation does not exist", async () => {
      (prisma.conversation.findUnique as any).mockResolvedValue(null);

      await expect(() =>
        conversations.message("uid-conv", "user-id", "Hello!"),
      ).rejects.toThrow(EchoNotFoundError);
    });

    it("should store a message if conversation exists", async () => {
      (prisma.conversation.findUnique as any).mockResolvedValue(true);

      const expectedMessage = {
        id: 1,
        conversationUid: "uid-conv",
        sender: "user-id",
        content: "Hello!",
      };

      (prisma.message.create as any).mockResolvedValue(expectedMessage);

      const result = await conversations.message("uid-conv", "user-id", "Hello!");

      expect(prisma.message.create).toHaveBeenCalledWith({
        data: {
          conversationUid: "uid-conv",
          sender: "user-id",
          content: "Hello!",
        },
      });

      expect(result).toEqual(expectedMessage);
    });
  });

  describe("get", () => {
    it("should throw if conversation not found", async () => {
      (prisma.conversation.findUnique as any).mockResolvedValue(null);

      await expect(() => conversations.get("uid-conv")).rejects.toThrow(EchoNotFoundError);
    });

    it("should return a conversation if found", async () => {
      const expectedConversation = {
        uid: "uid-conv",
        answers: [],
        messages: [],
        assessments: [],
      };

      (prisma.conversation.findUnique as any).mockResolvedValue(expectedConversation);

      const result = await conversations.get("uid-conv");

      expect(prisma.conversation.findUnique).toHaveBeenCalledWith({
        where: { uid: "uid-conv" },
        include: {
          answers: true,
          messages: true,
          assessments: true,
        },
      });

      expect(result).toEqual(expectedConversation);
    });
  });

  describe("exists", () => {
    it("should return true if conversation exists", async () => {
      (prisma.conversation.findUnique as any).mockResolvedValue({ uid: "uid-conv" });

      const result = await conversations.exists("uid-conv");

      expect(result).toBe(true);
    });

    it("should return false if conversation does not exist", async () => {
      (prisma.conversation.findUnique as any).mockResolvedValue(null);

      const result = await conversations.exists("uid-conv");

      expect(result).toBe(false);
    });
  });
});
