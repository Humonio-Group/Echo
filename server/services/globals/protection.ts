import type { Callback, HttpEvent } from "~/types/globals/http";
import { catchError } from "~/server/services/globals/errors";
import { EchoUnauthorizedError } from "~/types/globals/errors";
import { clerkClient } from "@clerk/nuxt/server";

export async function protect(event: HttpEvent, callback: Callback) {
  const { userId } = event.context.auth();

  if (!userId) return catchError(event, new EchoUnauthorizedError("Not logged in."));

  event.context.user = await clerkClient(event).users.getUser(userId);
  return callback(event);
}
