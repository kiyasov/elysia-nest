import { describe, expect, it } from "bun:test";

import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "~/src/exceptions";

describe("HttpException", () => {
  describe("Base HttpException", () => {
    it("should create exception with string message", () => {
      const exception = new HttpException("Something went wrong", 500);

      expect(exception.message).toBe("Something went wrong");
      expect(exception.statusCode).toBe(500);
      expect(exception.name).toBe("HttpException");
    });

    it("should create exception with object response", () => {
      const response = {
        error: "Validation failed",
        fields: ["email", "name"],
      };
      const exception = new HttpException(response, 400);

      expect(exception.getResponse()).toEqual(response);
      expect(exception.message).toBe(JSON.stringify(response));
    });

    it("should store additional details", () => {
      const details = { timestamp: "2024-01-01", path: "/api/test" };
      const exception = new HttpException("Error", 500, details);

      expect(exception.details).toEqual(details);
    });

    it("should be an instance of Error", () => {
      const exception = new HttpException("Error", 500);

      expect(exception).toBeInstanceOf(Error);
      expect(exception).toBeInstanceOf(HttpException);
    });

    it("should capture stack trace", () => {
      const exception = new HttpException("Error", 500);

      expect(exception.stack).toBeDefined();
      expect(exception.stack).toContain("HttpException");
    });
  });

  describe("BadRequestException", () => {
    it("should create with default message", () => {
      const exception = new BadRequestException();

      expect(exception.message).toBe("Bad Request");
      expect(exception.statusCode).toBe(400);
      expect(exception.name).toBe("BadRequestException");
    });

    it("should create with custom message", () => {
      const exception = new BadRequestException("Invalid input data");

      expect(exception.message).toBe("Invalid input data");
      expect(exception.statusCode).toBe(400);
    });

    it("should create with object response", () => {
      const response = { error: "Validation failed", fields: ["email"] };
      const exception = new BadRequestException(response);

      expect(exception.getResponse()).toEqual(response);
      expect(exception.statusCode).toBe(400);
    });

    it("should be instance of HttpException", () => {
      const exception = new BadRequestException();

      expect(exception).toBeInstanceOf(HttpException);
    });
  });

  describe("UnauthorizedException", () => {
    it("should create with default message", () => {
      const exception = new UnauthorizedException();

      expect(exception.message).toBe("Unauthorized");
      expect(exception.statusCode).toBe(401);
      expect(exception.name).toBe("UnauthorizedException");
    });

    it("should create with custom message", () => {
      const exception = new UnauthorizedException("Token expired");

      expect(exception.message).toBe("Token expired");
      expect(exception.statusCode).toBe(401);
    });

    it("should create with object response", () => {
      const response = {
        error: "Authentication required",
        reason: "missing_token",
      };
      const exception = new UnauthorizedException(response);

      expect(exception.getResponse()).toEqual(response);
      expect(exception.statusCode).toBe(401);
    });

    it("should be instance of HttpException", () => {
      const exception = new UnauthorizedException();

      expect(exception).toBeInstanceOf(HttpException);
    });
  });

  describe("ForbiddenException", () => {
    it("should create with default message", () => {
      const exception = new ForbiddenException();

      expect(exception.message).toBe("Forbidden");
      expect(exception.statusCode).toBe(403);
      expect(exception.name).toBe("ForbiddenException");
    });

    it("should create with custom message", () => {
      const exception = new ForbiddenException("Access denied");

      expect(exception.message).toBe("Access denied");
      expect(exception.statusCode).toBe(403);
    });

    it("should create with object response", () => {
      const response = {
        error: "Insufficient permissions",
        requiredRole: "admin",
      };
      const exception = new ForbiddenException(response);

      expect(exception.getResponse()).toEqual(response);
      expect(exception.statusCode).toBe(403);
    });

    it("should be instance of HttpException", () => {
      const exception = new ForbiddenException();

      expect(exception).toBeInstanceOf(HttpException);
    });
  });

  describe("NotFoundException", () => {
    it("should create with default message", () => {
      const exception = new NotFoundException();

      expect(exception.message).toBe("Not Found");
      expect(exception.statusCode).toBe(404);
      expect(exception.name).toBe("NotFoundException");
    });

    it("should create with custom message", () => {
      const exception = new NotFoundException("User not found");

      expect(exception.message).toBe("User not found");
      expect(exception.statusCode).toBe(404);
    });

    it("should create with object response", () => {
      const response = {
        error: "Resource not found",
        resource: "User",
        id: "123",
      };
      const exception = new NotFoundException(response);

      expect(exception.getResponse()).toEqual(response);
      expect(exception.statusCode).toBe(404);
    });

    it("should be instance of HttpException", () => {
      const exception = new NotFoundException();

      expect(exception).toBeInstanceOf(HttpException);
    });
  });

  describe("InternalServerErrorException", () => {
    it("should create with default message", () => {
      const exception = new InternalServerErrorException();

      expect(exception.message).toBe("Internal Server Error");
      expect(exception.statusCode).toBe(500);
      expect(exception.name).toBe("InternalServerErrorException");
    });

    it("should create with custom message", () => {
      const exception = new InternalServerErrorException(
        "Database connection failed",
      );

      expect(exception.message).toBe("Database connection failed");
      expect(exception.statusCode).toBe(500);
    });

    it("should create with object response", () => {
      const response = { error: "Server error", details: "Connection timeout" };
      const exception = new InternalServerErrorException(response);

      expect(exception.getResponse()).toEqual(response);
      expect(exception.statusCode).toBe(500);
    });

    it("should be instance of HttpException", () => {
      const exception = new InternalServerErrorException();

      expect(exception).toBeInstanceOf(HttpException);
    });
  });

  describe("Exception inheritance", () => {
    it("should support instanceof checks", () => {
      const badRequest = new BadRequestException();
      const unauthorized = new UnauthorizedException();
      const forbidden = new ForbiddenException();
      const notFound = new NotFoundException();
      const serverError = new InternalServerErrorException();

      expect(badRequest).toBeInstanceOf(HttpException);
      expect(unauthorized).toBeInstanceOf(HttpException);
      expect(forbidden).toBeInstanceOf(HttpException);
      expect(notFound).toBeInstanceOf(HttpException);
      expect(serverError).toBeInstanceOf(HttpException);
    });

    it("should support specific instanceof checks", () => {
      const badRequest = new BadRequestException();

      expect(badRequest).toBeInstanceOf(BadRequestException);
      expect(badRequest).not.toBeInstanceOf(NotFoundException);
    });
  });

  describe("getResponse()", () => {
    it("should return string for string message", () => {
      const exception = new HttpException("Simple error", 400);

      expect(typeof exception.getResponse()).toBe("string");
      expect(exception.getResponse()).toBe("Simple error");
    });

    it("should return object for object message", () => {
      const response = { error: "Complex error", code: "ERR_001" };
      const exception = new HttpException(response, 400);

      expect(typeof exception.getResponse()).toBe("object");
      expect(exception.getResponse()).toEqual(response);
    });

    it("should return same object reference", () => {
      const response = { data: [1, 2, 3] };
      const exception = new HttpException(response, 400);

      expect(exception.getResponse()).toBe(response);
    });
  });

  describe("Error chaining", () => {
    it("should work with throw/catch", () => {
      const original = new BadRequestException("Original error");

      try {
        throw original;
      } catch (e) {
        expect(e).toBe(original);
        expect(e).toBeInstanceOf(HttpException);
      }
    });

    it("should preserve properties when caught", () => {
      const exception = new NotFoundException("Not found");

      try {
        throw exception;
      } catch (e: any) {
        expect(e.statusCode).toBe(404);
        expect(e.message).toBe("Not found");
        expect(e.name).toBe("NotFoundException");
      }
    });
  });
});
