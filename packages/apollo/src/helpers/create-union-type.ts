import "reflect-metadata";

import { UNION_TYPE_METADATA } from "../decorators/constants";

/**
 * Creates a GraphQL Union type from the given options.
 * The returned class can be used as a `@Field(() => UnionType)` type.
 *
 * @typeParam T - Tuple of union member constructors.
 * @param options - Union type configuration.
 * @returns A class that can be used as a GraphQL union type.
 *
 * @example
 * ```typescript
 * export const SearchResult = createUnionType({
 *   name: 'SearchResult',
 *   types: () => [User, Post] as const,
 *   resolveType(value) {
 *     return 'name' in value ? User : Post;
 *   },
 * });
 *
 * @Query(() => [SearchResult])
 * async search(@Args('query') query: string) {
 *   return this.searchService.search(query);
 * }
 * ```
 */
export function createUnionType<
  T extends readonly (new (...args: unknown[]) => object)[],
>(options: {
  /** Name of the union type in the GraphQL schema. */
  name: string;
  /** Factory function returning array of types in the union. */
  types: () => T;
  /**
   * Function to determine the concrete type of a resolved value.
   * May return a type name string or a class constructor from the union.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolveType?: (value: any) => string | T[number] | null | undefined;
  /** Description of the union type. */
  description?: string;
}): new (...args: unknown[]) => InstanceType<T[number]> {
  class UnionPlaceholder {}
  Reflect.defineMetadata(UNION_TYPE_METADATA, options, UnionPlaceholder);
  return UnionPlaceholder as unknown as new (...args: unknown[]) => InstanceType<T[number]>;
}
