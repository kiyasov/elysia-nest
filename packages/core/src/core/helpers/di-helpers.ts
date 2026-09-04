import type { Type } from "../../di";
import { INJECT_METADATA } from "../../di/injectable.decorator";
import { createClassMetadataCache } from "../../utils/metadata-cache";

const paramTypesCache = createClassMetadataCache<(Type | undefined)[]>();
const injectMetadataCache = createClassMetadataCache<Array<{ index: number; token: unknown }>>();

/**
 * Get constructor dependencies for a class.
 *
 * @param target The class to get dependencies for
 * @returns Array of dependency metadata
 */
export function getConstructorDependencies(
  target: Type,
): Array<{ index: number; token: unknown }> {
  const paramTypes = paramTypesCache.get(target, () =>
    Reflect.getMetadata("design:paramtypes", target) || [],
  );
  const injectionMetadata = injectMetadataCache.get(target, () =>
    Reflect.getMetadata(INJECT_METADATA, target) || [],
  );

  const injectionByIndex = new Map<number, unknown>();
  for (const { index, token } of injectionMetadata) {
    injectionByIndex.set(index, token);
  }

  const dependencies: Array<{ index: number; token: unknown }> = [];
  const explicitParamCount = Math.max(
    ...injectionMetadata.map(({ index }) => index + 1),
    0,
  );
  const paramCount = Math.max(paramTypes.length, explicitParamCount);

  for (let i = 0; i < paramCount; i++) {
    const paramType = paramTypes[i];
    const token = injectionByIndex.has(i)
      ? injectionByIndex.get(i)
      : paramType;

    if (token !== undefined) {
      dependencies.push({ index: i, token });
    }
  }

  return dependencies;
}
