import { StatusCode } from "~/types/globals/http";

export class EchoError extends Error {
  code: StatusCode;

  constructor(code: StatusCode, message?: string) {
    super(message);
    this.code = code;
  }
}

export class EchoBadRequestError extends EchoError {
  constructor(message?: string) {
    super(StatusCode.BAD_REQUEST, message ?? "Something is missing in the request!");
  }
}
export class EchoUnauthorizedError extends EchoError {
  constructor(message?: string) {
    super(StatusCode.UNAUTHORIZED, message ?? "Unauthorized!");
  }
}
export class EchoNotEnoughPermissionsError extends EchoError {
  constructor(message?: string) {
    super(StatusCode.FORBIDDEN, message ?? "Not enough permissions!");
  }
}
export class EchoNotFoundError extends EchoError {
  constructor(message?: string) {
    super(StatusCode.NOT_FOUND, message);
  }
}
export class EchoConflictError extends EchoError {
  constructor(message?: string) {
    super(StatusCode.CONFLICT, message ?? "Conflicting data!");
  }
}

export class EchoServerError extends EchoError {
  constructor(message?: string) {
    super(StatusCode.INTERNAL, message ?? "Internal server error!");
  }
}
