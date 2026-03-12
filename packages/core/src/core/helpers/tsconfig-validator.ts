/**
 * Validates that the TypeScript compiler options required by elysia-nest are enabled.
 *
 * Detects missing `reflect-metadata` import and disabled `emitDecoratorMetadata` /
 * `experimentalDecorators` options by probing runtime behaviour rather than
 * reading tsconfig.json directly (which is unavailable at runtime).
 */

function assertReflectMetadata(): void {
  if (
    typeof Reflect === "undefined" ||
    typeof (Reflect as Record<string, unknown>).getMetadata !== "function"
  ) {
    throw new Error(
      "[elysia-nest] reflect-metadata is not available.\n" +
        "Add the following import at the very top of your entry file:\n\n" +
        '  import "reflect-metadata";\n',
    );
  }
}

/**
 * A probe class used to detect whether `emitDecoratorMetadata` and
 * `experimentalDecorators` are enabled in the user's tsconfig.
 *
 * The decorator intentionally does nothing — its sole purpose is to give
 * TypeScript a reason to emit `design:paramtypes` metadata for the class.
 */
function _probe(_target: object, _key: string, _descriptor: PropertyDescriptor): PropertyDescriptor {
  return _descriptor;
}

class _MetadataProbe {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @_probe
  static check(_value: string): boolean {
    return true;
  }
}

function assertDecoratorMetadata(): void {
  const paramTypes = Reflect.getMetadata(
    "design:paramtypes",
    _MetadataProbe,
    "check",
  ) as unknown[] | undefined;

  if (!Array.isArray(paramTypes)) {
    throw new Error(
      "[elysia-nest] Decorator metadata is not being emitted.\n" +
        "Your tsconfig.json must include:\n\n" +
        '  "experimentalDecorators": true,\n' +
        '  "emitDecoratorMetadata": true\n\n' +
        "Without these options decorators will not work correctly.",
    );
  }
}

export function validateTsConfig(): void {
  assertReflectMetadata();
  assertDecoratorMetadata();
}
