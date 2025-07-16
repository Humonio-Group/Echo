import type { Callback, HttpEvent } from "~/types/globals/http";
import { catchError } from "~/server/services/globals/errors";
import { EchoUnauthorizedError } from "~/types/globals/errors";
import { clerkClient } from "@clerk/nuxt/server";
import { recoverWorkspace } from "~/server/services/workspaces/workspaces";

export async function protect(event: HttpEvent, callback: Callback) {
  const { userId } = event.context.auth();

  if (!userId) return catchError(event, new EchoUnauthorizedError("Not logged in."));
  if (getRouterParam(event, "workspaceId")) event.context.workspace = await recoverWorkspace(event);

  event.context.user = await clerkClient(event).users.getUser(userId);
  return callback(event);
}
