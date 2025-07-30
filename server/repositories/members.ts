import type { ERole } from "~/types/workspaces";
import type { Prisma } from "@prisma/client";
import prisma from "~/prisma";
import { EchoConflictError, EchoServerError } from "~/types/globals/errors";

export async function create(userId: string, workspaceId: number, role?: ERole) {
  try {
    return await prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId,
        role,
      },
    });
  }
  catch (e) {
    switch ((e as Prisma.PrismaClientKnownRequestError).code) {
      case "P2002": {
        throw new EchoConflictError("Already exists in this workspace!");
      }
      default: {
        throw new EchoServerError((e as Error).message);
      }
    }
  }
}
