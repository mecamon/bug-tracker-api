export class InvalidPropertyError extends Error {
  constructor(msg) {
    super(msg);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPropertyError);
    }
  }
}

export class UnauthorizedError extends Error {
  constructor(msg) {
    super(msg);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnauthorizedError);
    }
  }
}

export class RequiredParamError extends Error {
  constructor(msg) {
    super(`${msg} param is required`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequiredParamError);
    }
  }
}

export class UsersLimitExeceded extends Error {
  constructor(msg) {
    super(msg);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UsersLimitExeceded);
    }
  }
}
