import { describe, expect, it } from "bun:test";
import { MessageSerializer } from "../src/connection/message-serializer";

describe("MessageSerializer", () => {
  describe("serialize", () => {
    it("serializes objects to Buffer", () => {
      const s = new MessageSerializer();
      const buf = s.serialize({ hello: "world" });
      expect(buf).toBeInstanceOf(Buffer);
      expect(JSON.parse(buf.toString())).toEqual({ hello: "world" });
    });

    it("throws when message exceeds size limit", () => {
      const s = new MessageSerializer(10);
      expect(() => s.serialize({ data: "x".repeat(100) })).toThrow(
        "exceeds maximum allowed size",
      );
    });

    it("accepts custom max size", () => {
      const s = new MessageSerializer(1_000_000);
      const buf = s.serialize({ ok: true });
      expect(buf.length).toBeGreaterThan(0);
    });
  });

  describe("parse", () => {
    it("parses valid JSON buffer back to object", () => {
      const s = new MessageSerializer();
      const buf = Buffer.from(JSON.stringify({ n: 42 }));
      expect(s.parse(buf)).toEqual({ n: 42 });
    });

    it("returns raw buffer for invalid JSON", () => {
      const s = new MessageSerializer();
      const buf = Buffer.from("not-json");
      expect(s.parse(buf)).toBeInstanceOf(Buffer);
    });

    it("strips __proto__ keys to prevent prototype pollution", () => {
      const s = new MessageSerializer();
      const buf = Buffer.from('{"__proto__":{"evil":true},"safe":1}');
      const result = s.parse<Record<string, unknown>>(buf);
      // __proto__ must not be an own property (no prototype pollution)
      expect(Object.prototype.hasOwnProperty.call(result, "__proto__")).toBe(false);
      expect((result as Record<string, unknown>).safe).toBe(1);
    });

    it("strips constructor keys", () => {
      const s = new MessageSerializer();
      const buf = Buffer.from('{"constructor":{"name":"hacked"},"ok":true}');
      const result = s.parse<Record<string, unknown>>(buf);
      // constructor must not be overridden as own property
      expect(Object.prototype.hasOwnProperty.call(result, "constructor")).toBe(false);
    });
  });

  describe("validateUrl", () => {
    it("accepts valid amqp URL", () => {
      expect(() => MessageSerializer.validateUrl("amqp://localhost:5672")).not.toThrow();
    });

    it("accepts amqps URL", () => {
      expect(() => MessageSerializer.validateUrl("amqps://user:pass@host:5671/vhost")).not.toThrow();
    });

    it("accepts URL without port", () => {
      expect(() => MessageSerializer.validateUrl("amqp://localhost")).not.toThrow();
    });

    it("throws for invalid protocol", () => {
      expect(() => MessageSerializer.validateUrl("http://localhost:5672")).toThrow(
        "Invalid RabbitMQ URL format",
      );
    });

    it("throws for completely invalid string", () => {
      expect(() => MessageSerializer.validateUrl("not-a-url")).toThrow(
        "Invalid RabbitMQ URL format",
      );
    });
  });

  describe("sanitizeExchangeName", () => {
    it("accepts valid names", () => {
      expect(MessageSerializer.sanitizeExchangeName("my-exchange.v1")).toBe("my-exchange.v1");
    });

    it("throws for invalid characters", () => {
      expect(() => MessageSerializer.sanitizeExchangeName("bad name!")).toThrow(
        "Invalid exchange name",
      );
    });

    it("throws for name exceeding max length", () => {
      expect(() =>
        MessageSerializer.sanitizeExchangeName("a".repeat(256)),
      ).toThrow("exceeds maximum length");
    });
  });

  describe("sanitizeQueueName", () => {
    it("accepts valid names", () => {
      expect(MessageSerializer.sanitizeQueueName("my_queue.1")).toBe("my_queue.1");
    });

    it("accepts empty string (auto-generated queue)", () => {
      expect(MessageSerializer.sanitizeQueueName("")).toBe("");
    });

    it("throws for invalid characters", () => {
      expect(() => MessageSerializer.sanitizeQueueName("bad queue!")).toThrow(
        "Invalid queue name",
      );
    });

    it("throws for name exceeding max length", () => {
      expect(() =>
        MessageSerializer.sanitizeQueueName("q".repeat(256)),
      ).toThrow("exceeds maximum length");
    });
  });
});
