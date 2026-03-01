export type ErrorCode =
  | "CONNECTION_ERROR"
  | "DEEPWIKI_ERROR"
  | "TIMEOUT"
  | "UNKNOWN";

export class DeepWikiError extends Error {
  readonly code: ErrorCode;

  constructor(message: string, code: ErrorCode) {
    super(message);
    this.name = "DeepWikiError";
    this.code = code;
  }
}

export function isRetryable(error: DeepWikiError): boolean {
  return error.code === "CONNECTION_ERROR" || error.code === "TIMEOUT";
}
