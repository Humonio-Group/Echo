vi.mock("~/prisma", () => ({
  default: {
    simulator: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      /* TODO:
      update: vi.fn(),
      delete: vi.fn(),
       */
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
});
