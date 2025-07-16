vi.mock("~/prisma", () => ({
  default: {
    workspace: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import * as workspaces from "~/server/repositories/workspaces";
import prisma from "~/prisma";

describe("manage workspaces", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("workspaceRepository.create", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should create a workspace with a default admin user", async () => {
      const expectedWorkspace = {
        id: 1,
        name: "testing",
        description: "testing",
        companyInfo: "",
        productOrService: "",
        values: "",
        ownerId: "testing",
        createdAt: "",
        updatedAt: "",
        members: [
          {
            workspaceId: 1,
            userId: "testing",
            role: "admin",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };
      const mockUserId = "testing";
      const mockData = {
        name: "testing",
        description: "testing",
      };

      (prisma.workspace.create as any).mockResolvedValue(expectedWorkspace);

      const result = await workspaces.create(mockUserId, mockData);

      expect(prisma.workspace.create).toHaveBeenCalledWith({
        data: {
          ...mockData,
          ownerId: mockUserId,
          members: {
            create: {
              userId: mockUserId,
              role: "admin",
            },
          },
        },
        include: {
          members: true,
          simulators: {
            include: {
              prepQuestions: true,
              evaluations: true,
            },
          },
        },
      });
      expect(result).toEqual(expectedWorkspace);
    });
  });

  describe("workspaceRepository.exists", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should not find the workspace with the specified id", async () => {
      (prisma.workspace.findUnique as any).mockResolvedValue(false);

      expect(await workspaces.exists(2)).toBe(false);
    });
  });

  describe("workspaceRepository.update", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should throw a 'Not Found Error'", async () => {
      const mockWorkspaceId = 1;
      const mockData = {
        description: "testing - bis",
      };

      (prisma.workspace.findUnique as any).mockResolvedValue(false);

      await expect(() => workspaces.update(mockWorkspaceId, mockData)).rejects.toThrow("Workspace not found");
    });
    it("should update a workspace with the new data", async () => {
      const expectedWorkspace = {
        id: 1,
        name: "testing",
        description: "testing - bis",
        companyInfo: "",
        productOrService: "",
        values: "",
        ownerId: "testing",
        createdAt: "",
        updatedAt: "",
        members: [
          {
            workspaceId: 1,
            userId: "testing",
            role: "admin",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };
      const mockWorkspaceId = 1;
      const mockData = {
        description: "testing - bis",
      };

      (prisma.workspace.findUnique as any).mockResolvedValue(true);
      (prisma.workspace.update as any).mockResolvedValue(expectedWorkspace);

      const result = await workspaces.update(mockWorkspaceId, mockData);

      expect(prisma.workspace.update).toHaveBeenCalledWith({
        where: {
          id: mockWorkspaceId,
        },
        data: mockData,
        include: {
          members: true,
          simulators: {
            include: {
              prepQuestions: true,
              evaluations: true,
            },
          },
        },
      });
      expect(result).toEqual(expectedWorkspace);
    });
  });

  describe("workspaceRepository.delete", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should throw a 'Not Found Error'", async () => {
      const mockWorkspaceId = 1;

      (prisma.workspace.findUnique as any).mockResolvedValue(false);

      await expect(() => workspaces.destroy(mockWorkspaceId)).rejects.toThrow("Workspace not found");
    });
    it("should delete a workspace and return its data", async () => {
      const expectedWorkspace = {
        id: 1,
        name: "testing",
        description: "testing - bis",
        companyInfo: "",
        productOrService: "",
        values: "",
        ownerId: "testing",
        createdAt: "",
        updatedAt: "",
        members: [
          {
            workspaceId: 1,
            userId: "testing",
            role: "admin",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };
      const mockWorkspaceId = 1;

      (prisma.workspace.findUnique as any).mockResolvedValue(true);
      (prisma.workspace.delete as any).mockResolvedValue(expectedWorkspace);

      const result = await workspaces.destroy(mockWorkspaceId);

      expect(prisma.workspace.delete).toBeCalledWith({
        where: {
          id: mockWorkspaceId,
        },
        include: {
          members: true,
          simulators: {
            include: {
              prepQuestions: true,
              evaluations: true,
            },
          },
        },
      });
      expect(result).toEqual(expectedWorkspace);
    });
  });

  describe("workspaceRepository.findForUser", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should recover a list of workspaces with basic info", async () => {
      const expectedList = [
        {
          id: 1,
          name: "testing",
          description: "testing - bis",
          companyInfo: "",
          productOrService: "",
          values: "",
          ownerId: "testing",
          createdAt: "",
          updatedAt: "",
          members: [
            {
              workspaceId: 1,
              userId: "testing",
              role: "admin",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
        {
          id: 2,
          name: "testing",
          description: "testing - bis",
          companyInfo: "",
          productOrService: "",
          values: "",
          ownerId: "testing",
          createdAt: "",
          updatedAt: "",
          members: [
            {
              workspaceId: 2,
              userId: "testing",
              role: "admin",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              workspaceId: 4,
              userId: "other-user",
              role: "member",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
      ];
      const mockUserId = "testing";

      (prisma.workspace.findMany as any).mockResolvedValue(expectedList);

      const result = await workspaces.findForUser(mockUserId);
      expect(prisma.workspace.findMany).toBeCalledWith({
        where: {
          members: {
            some: {
              userId: mockUserId,
            },
          },
        },
        include: {
          members: true,
          simulators: {
            include: {
              prepQuestions: true,
              evaluations: true,
            },
          },
        },
      });
      expect(result).toHaveLength(2);
      expect(result).toEqual(expectedList);
    });
  });

  describe("workspaceRepository.find", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should throw a 'Not Found Error'", async () => {
      const mockWorkspaceId = 1;

      (prisma.workspace.findUnique as any).mockResolvedValue(false);

      await expect(() => workspaces.find(mockWorkspaceId)).rejects.toThrow("Workspace not found");
    });
    it("should recover the targeted workspace", async () => {
      const expectedWorkspace = {
        id: 1,
        name: "testing",
        description: "testing",
        companyInfo: "",
        productOrService: "",
        values: "",
        ownerId: "testing",
        createdAt: "",
        updatedAt: "",
        members: [
          {
            workspaceId: 1,
            userId: "testing",
            role: "admin",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        simulators: [],
      };
      const mockWorkspaceId = 1;

      (prisma.workspace.findUnique as any).mockResolvedValue(expectedWorkspace);

      const result = await workspaces.find(mockWorkspaceId);

      expect(prisma.workspace.findUnique).toHaveBeenLastCalledWith({
        where: {
          id: mockWorkspaceId,
        },
        include: {
          members: true,
          simulators: {
            include: {
              prepQuestions: true,
              evaluations: true,
            },
          },
        },
      });
      expect(result).toEqual(expectedWorkspace);
    });
  });
});
