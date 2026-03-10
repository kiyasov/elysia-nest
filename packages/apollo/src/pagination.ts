import "reflect-metadata";

import { Field, ObjectType } from "./decorators/type.decorator";
import { Int } from "./decorators/type.decorator";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyConstructor = abstract new (...args: any[]) => unknown;
type Constructor<T = unknown> = new (...args: unknown[]) => T;

// ── PageInfo ──────────────────────────────────────────────────────────────────

/**
 * Standard Relay-style PageInfo object. Included in every Connection type.
 *
 * @publicApi
 */
@ObjectType({ description: "Pagination metadata for cursor-based navigation." })
export class PageInfo {
  @Field(() => Boolean)
  hasNextPage!: boolean;

  @Field(() => Boolean)
  hasPreviousPage!: boolean;

  @Field(() => String, { nullable: true })
  startCursor?: string;

  @Field(() => String, { nullable: true })
  endCursor?: string;
}

// ── Paginated (simple offset-based) ──────────────────────────────────────────

/**
 * Creates a simple paginated response type for a given item class.
 * Fields: `items`, `total`, `hasNextPage`, `hasPreviousPage`.
 *
 * @example
 * ```typescript
 * @ObjectType()
 * class BooksPage extends Paginated(Book) {}
 *
 * @Query(() => BooksPage)
 * books(@Args() args: BooksArgs): BooksPage { ... }
 * ```
 *
 * @publicApi
 */
export function Paginated<T>(ItemType: Constructor<T>): AnyConstructor {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [ItemType])
    items!: T[];

    @Field(() => Int)
    total!: number;

    @Field(() => Boolean)
    hasNextPage!: boolean;

    @Field(() => Boolean)
    hasPreviousPage!: boolean;
  }

  return PaginatedType;
}

// ── Relay Connection / Edge ───────────────────────────────────────────────────

/**
 * Creates a Relay-style Edge type for a given node class.
 * Fields: `node`, `cursor`.
 *
 * @publicApi
 */
export function createEdgeType<T>(NodeType: Constructor<T>): AnyConstructor {
  @ObjectType({ isAbstract: true })
  abstract class EdgeType {
    @Field(() => NodeType)
    node!: T;

    @Field(() => String)
    cursor!: string;
  }

  return EdgeType;
}

/**
 * Creates a Relay-style Connection type for a given node class.
 * Fields: `edges`, `pageInfo`, `totalCount`.
 *
 * @example
 * ```typescript
 * @ObjectType()
 * class BookEdge extends createEdgeType(Book) {}
 *
 * @ObjectType()
 * class BookConnection extends createConnectionType(Book, BookEdge) {}
 *
 * @Query(() => BookConnection)
 * booksConnection(@Args('after', { nullable: true }) after?: string): BookConnection { ... }
 * ```
 *
 * @publicApi
 */
export function createConnectionType<T>(
  NodeType: Constructor<T>,
  EdgeType?: AnyConstructor,
): AnyConstructor {
  const EdgeClass = EdgeType ?? createEdgeType(NodeType);

  @ObjectType({ isAbstract: true })
  abstract class ConnectionType {
    @Field(() => [EdgeClass])
    edges!: unknown[];

    @Field(() => PageInfo)
    pageInfo!: PageInfo;

    @Field(() => Int)
    totalCount!: number;
  }

  return ConnectionType;
}
