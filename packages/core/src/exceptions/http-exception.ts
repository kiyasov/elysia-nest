/**
 * Base class for HTTP exceptions
 */
export class HttpException extends Error {
  constructor(
    private readonly response: string | Record<string, unknown>,
    public readonly statusCode: number,
    public readonly details?: Record<string, unknown>,
  ) {
    super(typeof response === "string" ? response : JSON.stringify(response));
    this.name = this.constructor.name;
  }

  /**
   * Get the exception response
   */
  getResponse(): string | Record<string, unknown> {
    return this.response;
  }
}
