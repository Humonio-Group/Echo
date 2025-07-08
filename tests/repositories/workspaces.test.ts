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

describe("workspace respository", () => {
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
      include: { members: true },
    });
    expect(result).toEqual(expectedWorkspace);
  });

  it("should not find the workspace with the specified id", async () => {
    (prisma.workspace.findUnique as any).mockResolvedValue(false);

    expect(await workspaces.exists(2)).toBe(false);
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
      include: { members: true },
    });
    expect(result).toEqual(expectedWorkspace);
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
      },
    });
    expect(result).toEqual(expectedWorkspace);
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
    });
    expect(result).toHaveLength(2);
    expect(result).toEqual(expectedList);
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
    };
    const mockWorkspaceId = 1;

    (prisma.workspace.findUnique as any).mockResolvedValue(expectedWorkspace);

    const result = await workspaces.find(mockWorkspaceId);

    expect(prisma.workspace.findUnique).toBeCalledWith({
      where: {
        id: mockWorkspaceId,
      },
      include: {
        members: true,
      },
    });
    expect(result).toEqual(expectedWorkspace);
  });
});
