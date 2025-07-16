import type { H3Event } from "h3";

export type HttpEvent = H3Event<Request>;
export enum StatusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  PARTIAL_CONTENT = 206,

  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  GONE = 410,

  INTERNAL = 500,
}

export type Callback = (event: HttpEvent) => Promise<unknown>;
