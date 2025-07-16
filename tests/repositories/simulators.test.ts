vi.mock("~/prisma", () => ({
  default: {
    simulator: {
      create: vi.fn(),
      findMany: vi.fn(),
      /* TODO:
      update: vi.fn(),
      findUnique: vi.fn(),
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
      const mockData = {
        title: "Simulator",
        description: "Simulator",
        picture: null,
        duration: 5,
        behaviorPrompt: "simulate",
        createdBy: "testing",
      };

      (prisma.simulator.create as any).mockResolvedValue(expectedSimulator);

      const result = await simulators.create(mockUserId, mockData);
      expect(prisma.simulator.create).toHaveBeenCalledWith({
        data: {
          ...mockData,
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

    it("should recover 2 simulators, 1 in workspace and 1 out", async () => {
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
          OR: [
            {
              workspaceId: mockWorkspaceId,
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
      expect(result).toHaveLength(2);
      expect(result).toEqual(expectedList);
    });
  });
});
