import "reflect-metadata";

import { beforeEach, describe, expect, it } from "bun:test";

import { Test } from "../../../packages/testing/src";
import { BooksResolver } from "./books.resolver";

describe("BooksResolver", () => {
  let resolver: BooksResolver;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [BooksResolver],
    }).compile();

    resolver = module.get(BooksResolver);
  });

  it("returns initial books list", () => {
    expect(resolver.books()).toHaveLength(2);
  });

  it("finds a book by id", () => {
    expect(resolver.book(1)?.title).toBe("The Great Gatsby");
  });

  it("returns null for unknown id", () => {
    expect(resolver.book(999)).toBeNull();
  });

  it("adds a book with default publishedAt", () => {
    const book = resolver.addBook("Brave New World", "Aldous Huxley");
    expect(book.title).toBe("Brave New World");
    expect(book.id).toBe(3);
    expect(book.publishedAt).toBeInstanceOf(Date);
  });

  it("adds a book with explicit publishedAt", () => {
    const date = new Date("2000-01-01");
    expect(resolver.addBook("Book", "Author", date).publishedAt).toEqual(date);
  });

  it("assigns incrementing ids", () => {
    const a = resolver.addBook("A", "AA");
    const b = resolver.addBook("B", "BB");
    expect(b.id).toBe(a.id + 1);
  });

  it("removes a book", () => {
    expect(resolver.removeBook(1)).toBe(true);
    expect(resolver.books()).toHaveLength(1);
  });

  it("returns false removing non-existent book", () => {
    expect(resolver.removeBook(999)).toBe(false);
  });

  describe("booksPage", () => {
    it("returns all books with default args", () => {
      const page = resolver.booksPage({ offset: 0, limit: 20 });
      expect(page.items).toHaveLength(2);
      expect(page.total).toBe(2);
      expect(page.hasNextPage).toBe(false);
      expect(page.hasPreviousPage).toBe(false);
    });

    it("paginates with offset and limit", () => {
      const page = resolver.booksPage({ offset: 1, limit: 1 });
      expect(page.items).toHaveLength(1);
      expect(page.items[0].id).toBe(2);
      expect(page.hasPreviousPage).toBe(true);
      expect(page.hasNextPage).toBe(false);
    });

    it("hasNextPage when more items exist", () => {
      const page = resolver.booksPage({ offset: 0, limit: 1 });
      expect(page.hasNextPage).toBe(true);
    });
  });
});
