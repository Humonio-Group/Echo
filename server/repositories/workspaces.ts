import type { IWorkspace, IWorkspaceCreate } from "~/types/workspaces";
import prisma from "~/prisma";

/**
 * Create a workspace and add the owner as admin user.
 * @param {string} userId - Clerk user id.
 * @param {IWorkspaceCreate} data - Workspace data.
 * @returns {IWorkspace} The created workspace with the default member.
 */
export async function create(userId: string, data: IWorkspaceCreate): Promise<IWorkspace> {
  return prisma.workspace.create({
    data: {
      ...data,
      ownerId: userId,
      members: {
        create: {
          userId,
          role: "admin",
        },
      },
    },
    include: {
      members: true,
    },
  });
}
export async function update() {}
export async function destroy() {}

export async function find() {}
export async function exists() {}

export async function addMember() {}
export async function editMember() {}
export async function removeMember() {}
