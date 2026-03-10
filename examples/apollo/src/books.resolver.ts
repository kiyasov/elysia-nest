import { Injectable } from "nestelia";
import {
  Args,
  ArgsType,
  Field,
  GraphQLDateTime,
  Int,
  Mutation,
  ObjectType,
  Paginated,
  Query,
  Resolver,
} from "../../../packages/apollo/src";

import { Book } from "./book.type";

@ArgsType()
class BooksArgs {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset!: number;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  limit!: number;
}

@ObjectType()
class BooksPage extends (Paginated(Book) as new () => {
  items: Book[];
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}) {}

@Resolver(() => Book)
@Injectable()
export class BooksResolver {
  private store: Book[] = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      publishedAt: new Date("1925-04-10"),
      coverUrl: "https://example.com/gatsby.jpg",
      metadata: { genre: "novel", pages: 180 },
    },
    {
      id: 2,
      title: "1984",
      author: "George Orwell",
      publishedAt: new Date("1949-06-08"),
      metadata: { genre: "dystopia", pages: 328 },
    },
  ];
  private nextId = 3;

  @Query(() => [Book])
  books(): Book[] {
    return this.store;
  }

  @Query(() => BooksPage)
  booksPage(@Args() args: BooksArgs): BooksPage {
    const items = this.store.slice(args.offset, args.offset + args.limit);
    return {
      items,
      total: this.store.length,
      hasNextPage: args.offset + args.limit < this.store.length,
      hasPreviousPage: args.offset > 0,
    };
  }

  @Query(() => Book, { nullable: true })
  book(@Args("id", { type: () => Int }) id: number): Book | null {
    return this.store.find((b) => b.id === id) ?? null;
  }

  @Mutation(() => Book)
  addBook(
    @Args("title") title: string,
    @Args("author") author: string,
    @Args("publishedAt", { type: () => GraphQLDateTime, nullable: true }) publishedAt?: Date,
  ): Book {
    const book: Book = {
      id: this.nextId++,
      title,
      author,
      publishedAt: publishedAt ?? new Date(),
    };
    this.store.push(book);
    return book;
  }

  @Mutation(() => Boolean)
  removeBook(@Args("id", { type: () => Int }) id: number): boolean {
    const idx = this.store.findIndex((b) => b.id === id);
    if (idx === -1) return false;
    this.store.splice(idx, 1);
    return true;
  }
}
