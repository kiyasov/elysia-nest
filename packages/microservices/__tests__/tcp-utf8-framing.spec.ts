import "reflect-metadata";

import { StringDecoder } from "node:string_decoder";
import { createConnection, type Socket } from "net";

import { afterEach, describe, expect, it } from "bun:test";

import { TcpServer } from "../src/transports/tcp.server";

/**
 * MS7 regression: multi-byte UTF-8 payloads that are split across TCP segments
 * must round-trip byte-for-byte. Decoding each chunk independently
 * (`chunk.toString()`) corrupts a UTF-8 sequence that straddles a chunk
 * boundary, breaking `JSON.parse` and silently dropping the frame.
 */
describe("TcpServer — MS7 UTF-8 framing across chunk boundaries", () => {
  let server: TcpServer;
  let raw: Socket | undefined;

  afterEach(() => {
    raw?.destroy();
    server?.close();
  });

  it("round-trips a payload split mid multi-byte character", async () => {
    server = new TcpServer({ host: "127.0.0.1", port: 0 });
    // Echo handler.
    server.addMessageHandler("echo", (data) => data);

    const port = await new Promise<number>((resolve) => {
      server.listen(() => {
        // Access the underlying net server's bound port.
        const addr = (server as unknown as { server: { address(): { port: number } } })
          .server.address();
        resolve(addr.port);
      });
    });

    // A large all-emoji payload: essentially every byte position is inside a
    // 4-byte UTF-8 sequence, so any mid-buffer split straddles a code point.
    const payload = "😀мир".repeat(500);
    const frame = Buffer.from(
      JSON.stringify({ id: "req-1", pattern: "echo", data: payload }) + "\n",
      "utf8",
    );

    // Find a split index that lands on a UTF-8 continuation byte (0b10xxxxxx),
    // guaranteeing the split falls inside a multi-byte sequence.
    let split = Math.floor(frame.length / 2);
    while (split < frame.length && (frame[split]! & 0xc0) !== 0x80) split++;

    const decoder = new StringDecoder("utf8");
    let replyBuf = "";

    const result = await new Promise<string>((resolve, reject) => {
      const guard = setTimeout(
        () => reject(new Error("no reply within guard — frame was dropped")),
        1500,
      );

      raw = createConnection({ host: "127.0.0.1", port }, () => {
        raw!.write(frame.subarray(0, split));
        setTimeout(() => raw!.write(frame.subarray(split)), 20);
      });

      raw.on("data", (chunk: Buffer) => {
        replyBuf += decoder.write(chunk);
        const nl = replyBuf.indexOf("\n");
        if (nl === -1) return;
        clearTimeout(guard);
        try {
          const parsed = JSON.parse(replyBuf.slice(0, nl)) as {
            data: string;
          };
          resolve(parsed.data);
        } catch (err) {
          reject(err as Error);
        }
      });

      raw.on("error", reject);
    });

    expect(result).toBe(payload);
  });
});
