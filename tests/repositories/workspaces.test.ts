vi.mock("~/prisma", () => ({
  default: {
    workspace: {
      create: vi.fn(),
    },
  },
}));

import * as workspaces from "@/server/repositories/workspaces";
import prisma from "~/prisma";

describe("workspaceRepository.create", () => {
  const mockUserId = "testing";
  const mockData = {
    name: "testing",
    description: "testing",
  };

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

    // 👇 Simuler le retour de Prisma
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
});
