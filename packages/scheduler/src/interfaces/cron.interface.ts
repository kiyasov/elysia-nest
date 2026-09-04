/**
 * Represents a cron expression for scheduled tasks
 */
export interface CronExpression {
  /**
   * Convert to a string representation
   */
  toString(): string;
}

/**
 * Fixed cron expression
 */
export class FixedCronExpression implements CronExpression {
  constructor(private readonly expression: string) {}

  toString(): string {
    return this.expression;
  }
}

/**
 * Cron expression presets
 */
export class CronExpressions {
  /**
   * Every second
   */
  static EVERY_SECOND = new FixedCronExpression("* * * * * *");

  /**
   * Every 5 seconds
   */
  static EVERY_5_SECONDS = new FixedCronExpression("*/5 * * * * *");

  /**
   * Every 10 seconds
   */
  static EVERY_10_SECONDS = new FixedCronExpression("*/10 * * * * *");

  /**
   * Every 30 seconds
   */
  static EVERY_30_SECONDS = new FixedCronExpression("*/30 * * * * *");

  /**
   * Every minute
   */
  static EVERY_MINUTE = new FixedCronExpression("0 * * * * *");

  /**
   * Every 5 minutes
   */
  static EVERY_5_MINUTES = new FixedCronExpression("0 */5 * * * *");

  /**
   * Every 10 minutes
   */
  static EVERY_10_MINUTES = new FixedCronExpression("0 */10 * * * *");

  /**
   * Every 30 minutes
   */
  static EVERY_30_MINUTES = new FixedCronExpression("0 */30 * * * *");

  /**
   * Every hour
   */
  static EVERY_HOUR = new FixedCronExpression("0 0 * * * *");

  /**
   * Every day at midnight
   */
  static EVERY_DAY_AT_MIDNIGHT = new FixedCronExpression("0 0 0 * * *");

  /**
   * Every day at noon
   */
  static EVERY_DAY_AT_NOON = new FixedCronExpression("0 0 12 * * *");

  /**
   * Every Sunday
   */
  static EVERY_SUNDAY = new FixedCronExpression("0 0 0 * * 0");

  /**
   * Every Monday
   */
  static EVERY_MONDAY = new FixedCronExpression("0 0 0 * * 1");

  /**
   * Every first day of the month
   */
  static EVERY_1ST_DAY_OF_MONTH = new FixedCronExpression("0 0 0 1 * *");
}

/**
 * Validates if a string is a valid cron expression
 * Supports 5-segment (minute hour day month day-of-week) and
 * 6-segment (second minute hour day month day-of-week) formats
 */
export function isValidCronExpression(expression: string): boolean {
  if (!expression || typeof expression !== "string") {
    return false;
  }

  // Prevent potential ReDoS by limiting length
  if (expression.length > 100) {
    return false;
  }

  const segments = expression.trim().split(/\s+/);

  // Support both 5 and 6 segment cron expressions
  if (segments.length !== 5 && segments.length !== 6) {
    return false;
  }

  // Cron field patterns
  // * = any value
  // */n = step values
  // n-m = range
  // n,m = list
  // ? = no specific value (for day of month/week)
  // L = last (for day of month/week)
  // W = weekday
  // # = nth occurrence
  const fieldPattern = /^[\d*,/\-?LW#]+$/;

  for (const segment of segments) {
    // Check for potentially dangerous characters
    if (!fieldPattern.test(segment)) {
      return false;
    }

    // Prevent script injection attempts
    if (/[<>"'`;{}[\]()]/.test(segment)) {
      return false;
    }
  }

  return true;
}
