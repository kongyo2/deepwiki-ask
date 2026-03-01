import { type Result, err } from "neverthrow";
import { DeepWikiError, isRetryable } from "./errors.js";

interface RetryOptions {
  maxRetries: number;
  initialDelayMs: number;
  backoffMultiplier: number;
}

const DEFAULT_OPTIONS: RetryOptions = {
  maxRetries: 3,
  initialDelayMs: 1000,
  backoffMultiplier: 2,
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry<T>(
  fn: () => Promise<Result<T, DeepWikiError>>,
  options: Partial<RetryOptions> = {},
): Promise<Result<T, DeepWikiError>> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    if (attempt > 0) {
      const delay =
        opts.initialDelayMs * opts.backoffMultiplier ** (attempt - 1);
      console.error(
        `[deepwiki-ask] Retry attempt ${attempt}/${opts.maxRetries} after ${delay}ms...`,
      );
      await sleep(delay);
    }

    const result = await fn();

    if (result.isOk()) {
      return result;
    }

    if (!isRetryable(result.error) || attempt === opts.maxRetries) {
      return result;
    }
  }

  return err(new DeepWikiError("Retry exhausted", "UNKNOWN"));
}
