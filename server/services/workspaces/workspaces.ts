import type { HttpEvent } from "~/types/globals/http";
import { StatusCode } from "~/types/globals/http";
import type { IWorkspaceCreate, IWorkspaceUpdate } from "~/types/workspaces";
import { catchError, setOutput } from "~/server/services/globals/errors";
import type { EchoError } from "~/types/globals/errors";
import { EchoBadRequestError } from "~/types/globals/errors";
import * as workspaces from "~/server/repositories/workspaces";

export async function createWorkspace(event: HttpEvent) {
  const body = await readBody<IWorkspaceCreate>(event);

  try {
    const workspace = await workspaces.create(event.context.user.id, body);
    setOutput(event, StatusCode.CREATED, `Workspace "${workspace.name}" created`);
    return workspace;
  }
  catch (e) {
    return catchError(event, e as EchoError);
  }
}

export async function recoverUserWorkspaces(event: HttpEvent) {
  const user = event.context.user;

  try {
    return await workspaces.findForUser(user.id);
  }
  catch (e) {
    return catchError(event, e as EchoError);
  }
}

export async function recoverWorkspace(event: HttpEvent) {
  const workspaceId = getRouterParam(event, "workspaceId");
  if (!workspaceId) return catchError(event, new EchoBadRequestError("Missing workspace id"));

  try {
    return await workspaces.find(Number(workspaceId));
  }
  catch (e) {
    return catchError(event, e as EchoError);
  }
}

export async function updateWorkspace(event: HttpEvent) {
  const body = await readBody<IWorkspaceUpdate>(event);
  const { id } = event.context.workspace;

  try {
    const workspace = await workspaces.update(id, body);

    setOutput(event, StatusCode.ACCEPTED, `Workspace "${workspace.name}" updated`);
    return workspace;
  }
  catch (e) {
    return catchError(event, e as EchoError);
  }
}
