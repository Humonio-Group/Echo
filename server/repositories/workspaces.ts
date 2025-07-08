import type { IWorkspace, IWorkspaceCreate, IWorkspaceUpdate } from "~/types/workspaces";
import prisma from "~/prisma";
import { EchoNotFoundError } from "~/types/globals/errors";
import type { TArray } from "~/types/globals/utils";

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

/**
 * Update a workspace with new data
 * @param {number} id - Workspace id.
 * @param {IWorkspaceUpdate} data - Data to update.
 * @throws {EchoNotFoundError} if the workspace doesn't exist.
 * @returns {IWorkspace} - The updated workspace.
 */
export async function update(id: number, data: IWorkspaceUpdate): Promise<IWorkspace> {
  if (!await exists(id)) throw new EchoNotFoundError("Workspace not found");
  return prisma.workspace.update({
    where: {
      id,
    },
    data,
    include: {
      members: true,
    },
  });
}

/**
 * Delete a workspace
 * @param {number} id - Workspace id.
 * @throws {EchoNotFoundError} if the workspace is not found.
 * @returns {IWorkspace} - The delete workspace data.
 */
export async function destroy(id: number): Promise<IWorkspace> {
  if (!await exists(id)) throw new EchoNotFoundError("Workspace not found");
  return prisma.workspace.delete({
    where: {
      id,
    },
    include: {
      members: true,
    },
  });
}

/**
 * Retrieve a specific workspace data
 * @param {number} id - Workspace id
 * @throws {EchoNotFoundError} if the workspace is not found.
 * @returns {IWorkspace} - The retrieved workspace.
 */
export async function find(id: number): Promise<IWorkspace> {
  if (!await exists(id)) throw new EchoNotFoundError("Workspace not found");
  return await prisma.workspace.findUnique({
    where: {
      id,
    },
    include: {
      members: true,
    },
  }) as IWorkspace;
}

/**
 * Get workspaces where the user is a member.
 * @param {string} userId - Clerk user id.
 * @returns {TArray<IWorkspace>} - The user's related workspaces list.
 */
export async function findForUser(userId: string): Promise<TArray<IWorkspace>> {
  return prisma.workspace.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
  });
}

/**
 * Verify if a workspace exists.
 * @param {number} id - Workspace id.
 * @returns {boolean} if a workspace is found.
 */
export async function exists(id: number): Promise<boolean> {
  return !!await prisma.workspace.findUnique({ where: { id } });
}

/* TODO: integrate the following
-> export async function addMember() {}
-> export async function editMember() {}
-> export async function removeMember() {}
 */
