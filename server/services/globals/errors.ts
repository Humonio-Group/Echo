import type { HttpEvent } from "~/types/globals/http";
import type { EchoError } from "~/types/globals/errors";

export function catchError(event: HttpEvent, error: EchoError) {
  event.node.res.statusCode = error.code;
  event.node.res.statusMessage = error.message;
  return event;
}
