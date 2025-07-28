vi.mock("~/prisma", () => ({
  default: {
    simulator: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    prepQuestion: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    evaluation: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import * as simulators from "~/server/repositories/simulators";
import prisma from "~/prisma";

describe("manage simulators", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("simulatorRepository.create", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should create a simulator with no questions and no evaluations", async () => {
      const expectedSimulator = {
        id: 1,
        workspaceId: 1,
        title: "Simulator",
        description: "Simulator",
        picture: null,
        duration: 5,
        behaviorPrompt: "simulate",
        createdBy: "testing",
        createdAt: new Date(),
        updatedAt: new Date(),
        prepQuestions: [],
        evaluations: [],
      };
      const mockUserId = "testing";
      const mockWorkspaceId = 1;
      const mockData = {
        title: "Simulator",
        description: "Simulator",
        picture: null,
        duration: 5,
        behaviorPrompt: "simulate",
        createdBy: "testing",
      };

      (prisma.simulator.create as any).mockResolvedValue(expectedSimulator);

      const result = await simulators.create(mockUserId, mockWorkspaceId, mockData);
      expect(prisma.simulator.create).toHaveBeenCalledWith({
        data: {
          ...mockData,
          workspaceId: mockWorkspaceId,
          createdBy: mockUserId,
          prepQuestions: {
            createMany: {
              data: [],
            },
          },
          evaluations: {
            createMany: {
              data: [],
            },
          },
        },
        include: {
          prepQuestions: true,
          evaluations: true,
        },
      });
      expect(result).toEqual(expectedSimulator);
    });
  });

  describe("simulatorRepository.getAll", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should recover 1 simulator", async () => {
      const expectedList = [
        {
          id: 2,
          workspaceId: 1,
          title: "Simulator",
          description: "Simulator",
          picture: null,
          duration: 5,
          behaviorPrompt: "simulate",
          createdBy: "testing",
          createdAt: new Date(),
          updatedAt: new Date(),
          prepQuestions: [],
          evaluations: [],
        },
      ];
      const mockWorkspaceId = 1;

      (prisma.simulator.findMany as any).mockResolvedValue(expectedList);

      const result = await simulators.getAll(mockWorkspaceId);
      expect(prisma.simulator.findMany).toBeCalledWith({
        where: {
          workspaceId: mockWorkspaceId,
        },
        include: {
          prepQuestions: true,
          evaluations: true,
        },
      });
      expect(result).toHaveLength(1);
      expect(result).toEqual(expectedList);
    });
  });

  describe("simulatorRepository.get", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should throw a not found error", async () => {
      const mockSimulatorId = 1;

      (prisma.simulator.findUnique as any).mockResolvedValue(false);

      await expect(() => simulators.get(mockSimulatorId)).rejects.toThrow("Simulator not found");
    });

    it("should recover the given simulator", async () => {
      const expectedSimulator = {
        id: 1,
        workspaceId: null,
        title: "ROPE Communicant",
        description: "Communique suivant le framework ROPE.",
        picture: null,
        duration: 15,
        behaviorPrompt: "Prompt de comportement",
        createdBy: "system",
        createdAt: new Date(),
        updatedAt: new Date(),
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
      };
      const mockSimulatorId = 1;

      (prisma.simulator.findUnique as any).mockResolvedValue(expectedSimulator);

      const result = await simulators.get(mockSimulatorId);

      expect(prisma.simulator.findUnique).toHaveBeenLastCalledWith({
        where: {
          id: mockSimulatorId,
          workspaceId: null,
        },
        include: {
          prepQuestions: true,
          evaluations: true,
        },
      });
      expect(result).toEqual(expectedSimulator);
    });
  });

  describe("simulatorRepository.getPublicLibrary", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should recover 1 simulator", async () => {
      const expectedList = [
        {
          id: 1,
          workspaceId: null,
          title: "Simulator",
          description: "Simulator",
          picture: null,
          duration: 5,
          behaviorPrompt: "simulate",
          createdBy: "testing",
          createdAt: new Date(),
          updatedAt: new Date(),
          prepQuestions: [],
          evaluations: [],
        },
      ];

      (prisma.simulator.findMany as any).mockResolvedValue(expectedList);

      const result = await simulators.getPublicLibrary();
      expect(prisma.simulator.findMany).toBeCalledWith({
        where: {
          workspaceId: null,
        },
        include: {
          prepQuestions: true,
          evaluations: true,
        },
      });
      expect(result).toHaveLength(1);
      expect(result).toEqual(expectedList);
    });
  });

  describe("simulatorRepository.update", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should update the simulator", async () => {
      const mockId = 1;
      const updateData = {
        title: "Updated title",
        description: "Updated description",
        duration: 10,
        picture: null,
        behaviorPrompt: "Updated prompt",
      };
      const expected = {
        ...updateData,
        id: mockId,
        prepQuestions: [],
        evaluations: [],
      };

      (prisma.simulator.update as any).mockResolvedValue(expected);

      const result = await simulators.update(mockId, updateData);
      expect(prisma.simulator.update).toHaveBeenCalledWith({
        where: { id: mockId },
        data: updateData,
        include: {
          prepQuestions: true,
          evaluations: true,
        },
      });
      expect(result).toEqual(expected);
    });
  });

  describe("simulatorRepository.destroy", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should delete the simulator", async () => {
      const mockId = 1;
      const expected = {
        id: mockId,
        prepQuestions: [],
        evaluations: [],
      };

      (prisma.simulator.delete as any).mockResolvedValue(expected);

      const result = await simulators.destroy(mockId);
      expect(prisma.simulator.delete).toHaveBeenCalledWith({
        where: { id: mockId },
        include: {
          prepQuestions: true,
          evaluations: true,
        },
      });
      expect(result).toEqual(expected);
    });
  });

  describe("simulatorRepository.prepQuestions", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should create a prep question", async () => {
      const simulatorId = 1;
      const data = { label: "What is your name?" };
      const expected = { id: 1, simulatorId, ...data };

      (prisma.prepQuestion.create as any) = vi.fn().mockResolvedValue(expected);

      const result = await simulators.createQuestion(simulatorId, data);
      expect(result).toEqual(expected);
      expect(prisma.prepQuestion.create).toHaveBeenCalledWith({
        data: { simulatorId, label: data.label },
      });
    });

    it("should update a prep question", async () => {
      const key = "abc123";
      const data = { label: "Updated question?" };
      const expected = { key, ...data };

      (prisma.prepQuestion.update as any) = vi.fn().mockResolvedValue(expected);

      const result = await simulators.updateQuestion(key, data);
      expect(result).toEqual(expected);
      expect(prisma.prepQuestion.update).toHaveBeenCalledWith({
        where: { key },
        data,
      });
    });

    it("should delete a prep question", async () => {
      const key = "abc123";
      const expected = { key };

      (prisma.prepQuestion.delete as any) = vi.fn().mockResolvedValue(expected);

      const result = await simulators.deleteQuestion(key);
      expect(result).toEqual(expected);
      expect(prisma.prepQuestion.delete).toHaveBeenCalledWith({
        where: { key },
      });
    });
  });

  describe("simulatorRepository.evaluations", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should create an evaluation", async () => {
      const simulatorId = 1;
      const data = {
        frameworkPrompt: "Framework",
        assessmentPrompt: "Assessment",
        feedbackPrompt: "Feedback",
      };
      const expected = { id: 1, simulatorId, ...data };

      (prisma.evaluation.create as any) = vi.fn().mockResolvedValue(expected);

      const result = await simulators.createEvaluation(simulatorId, data);
      expect(result).toEqual(expected);
      expect(prisma.evaluation.create).toHaveBeenCalledWith({
        data: { simulatorId, ...data },
      });
    });

    it("should update an evaluation", async () => {
      const key = "eval123";
      const data = {
        frameworkPrompt: "Updated framework",
        assessmentPrompt: "Updated assessment",
        feedbackPrompt: "Updated feedback",
      };
      const expected = { key, ...data };

      (prisma.evaluation.update as any) = vi.fn().mockResolvedValue(expected);

      const result = await simulators.updateEvaluation(key, data);
      expect(result).toEqual(expected);
      expect(prisma.evaluation.update).toHaveBeenCalledWith({
        where: { key },
        data,
      });
    });

    it("should delete an evaluation", async () => {
      const key = "eval123";
      const expected = { key };

      (prisma.evaluation.delete as any) = vi.fn().mockResolvedValue(expected);

      const result = await simulators.deleteEvaluation(key);
      expect(result).toEqual(expected);
      expect(prisma.evaluation.delete).toHaveBeenCalledWith({
        where: { key },
      });
    });
  });
});
