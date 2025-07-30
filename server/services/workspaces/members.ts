import type { HttpEvent } from "~/types/globals/http";
import { StatusCode } from "~/types/globals/http";
import { catchError, setOutput } from "~/server/services/globals/errors";
import type { EchoError } from "~/types/globals/errors";
import * as members from "~/server/repositories/members";

export async function createMemberAccess(event: HttpEvent) {
  const workspace = event.context.workspace;
  const userId = (await readBody<{ userId: string }>(event)).userId;

  try {
    const member = await members.create(userId, workspace.id);

    setOutput(event, StatusCode.CREATED, "Member added to workspace!");
    return member;
  }
  catch (e) {
    return catchError(event, e as EchoError);
  }
}

export async function recoverWorkspaceMembers(event: HttpEvent) {
  const workspace = event.context.workspace;
  const members = workspace.members ?? [];

  try {
    return members;
  }
  catch (e) {
    return catchError(event, e as EchoError);
  }
}
