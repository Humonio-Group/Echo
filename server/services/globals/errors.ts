import type { HttpEvent, StatusCode } from "~/types/globals/http";
import type { EchoError } from "~/types/globals/errors";

export function setOutput(event: HttpEvent, code: StatusCode, message: string = "") {
  event.node.res.statusCode = code;
  event.node.res.statusMessage = message;
  return event;
}

export function catchError(event: HttpEvent, error: EchoError) {
  event.node.res.statusCode = error.code;
  event.node.res.statusMessage = error.message;
  return event;
}
