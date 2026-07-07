import { randomUUID } from "node:crypto";
import { StringDecoder } from "node:string_decoder";
import { createServer, type Server as NetServer, type Socket } from "net";

import type { TcpOptions } from "../interfaces";
import { BaseServer } from "./server";

/** Maximum number of bytes buffered per connection before the socket is closed. */
const MAX_BUFFER_SIZE = 1_048_576; // 1 MiB

interface TcpMessage {
  id: string;
  pattern: string;
  data: unknown;
}

interface TcpResponse {
  id: string;
  data?: unknown;
  error?: string;
}

/**
 * Transport server that uses raw TCP sockets with newline-delimited JSON
 * framing for request-response and fire-and-forget communication.
 *
 * Protocol:
 * - Each message is a single JSON object followed by `\n`.
 * - Request-response: client sends `{ id, pattern, data }`;
 *   server replies with `{ id, data }` or `{ id, error }`.
 * - Fire-and-forget: server-initiated; no reply expected.
 */
export class TcpServer extends BaseServer {
  private server?: NetServer;
  private readonly sockets = new Set<Socket>();
  private readonly pendingReplies = new Map<
    string,
    (response: TcpResponse) => void
  >();
  private isListening = false;

  constructor(private readonly options: TcpOptions) {
    super();
  }

  /**
   * Starts the TCP server on the configured host/port.
   * Defaults to `0.0.0.0:3000`.
   */
  public listen(callback?: (err?: unknown) => void): void {
    const host = this.options.host ?? "0.0.0.0";
    const port = this.options.port ?? 3000;

    try {
      this.server = createServer((socket) => this.handleConnection(socket));

      this.server.listen(port, host, () => {
        this.isListening = true;
        this.emit("ready");
        callback?.();
      });

      this.server.on("error", (err) => {
        // Settle the start promise first (e.g. EADDRINUSE) so the caller is
        // never left hanging, then surface the error via the guarded helper —
        // which must never throw even when no "error" listener is attached.
        if (!this.isListening) {
          callback?.(err);
        }
        this.emitError(err);
      });
    } catch (err) {
      if (callback) {
        callback(err);
      } else {
        throw err;
      }
    }
  }

  private handleConnection(socket: Socket): void {
    this.sockets.add(socket);
    // Per-socket incremental UTF-8 decoder: a multi-byte sequence split across
    // TCP segments is buffered internally until complete, so it is never
    // decoded into replacement characters (which would corrupt the JSON frame).
    const decoder = new StringDecoder("utf8");
    let buffer = "";

    socket.on("data", (chunk: Buffer) => {
      buffer += decoder.write(chunk);

      // Guard against unbounded buffer growth (e.g. malformed / malicious
      // clients). Measured in bytes so the limit is a true byte count.
      if (Buffer.byteLength(buffer) > MAX_BUFFER_SIZE) {
        socket.destroy(
          new Error(
            `TCP buffer overflow: message exceeded ${MAX_BUFFER_SIZE} bytes`,
          ),
        );
        buffer = "";
        return;
      }

      // Newline-delimited JSON framing.
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.trim()) {
          void this.handleMessageLine(line, socket);
        }
      }
    });

    socket.on("close", () => this.sockets.delete(socket));

    socket.on("error", (err) => {
      this.emitError(err);
      this.sockets.delete(socket);
    });
  }

  private async handleMessageLine(
    line: string,
    socket: Socket,
  ): Promise<void> {
    let message: TcpMessage;

    try {
      message = JSON.parse(line) as TcpMessage;
    } catch {
      // Silently discard malformed frames.
      return;
    }

    const { id, pattern, data } = message;

    if (!id || !pattern) {
      return; // Ignore structurally invalid messages.
    }

    // If this is a pending reply (server-initiated RPC), resolve it.
    const pendingResolve = this.pendingReplies.get(id);
    if (pendingResolve) {
      pendingResolve({ id, data });
      this.pendingReplies.delete(id);
      return;
    }

    const ctx: Record<string, unknown> = { pattern, transport: "tcp", socket };

    if (this.messageHandlers.has(pattern)) {
      try {
        const response = await this.handleMessage(pattern, data, ctx);
        socket.write(JSON.stringify({ id, data: response } satisfies TcpResponse) + "\n");
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : String(err);
        socket.write(JSON.stringify({ id, error: errorMsg } satisfies TcpResponse) + "\n");
      }
    } else if (this.eventHandlers.has(pattern)) {
      this.handleEvent(pattern, data, ctx);
    }
  }

  /**
   * Sends a request to the first connected client and waits for a reply.
   * The default timeout is **5 seconds**.
   */
  public sendMessage<T = unknown>(pattern: string, data: T): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const socket = this.sockets.values().next().value as Socket | undefined;
      if (!socket) {
        reject(new Error("No connected clients"));
        return;
      }

      const id = randomUUID();
      const message: TcpMessage = { id, pattern, data };

      const timer = setTimeout(() => {
        this.pendingReplies.delete(id);
        reject(new Error(`Request timeout for pattern: "${pattern}"`));
      }, 5_000);

      this.pendingReplies.set(id, (response: TcpResponse) => {
        clearTimeout(timer);
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response.data);
        }
      });

      socket.write(JSON.stringify(message) + "\n");
    });
  }

  /** Broadcasts a fire-and-forget event to all connected clients. */
  public emitEvent<T = unknown>(pattern: string, data: T): void {
    const line =
      JSON.stringify({ id: randomUUID(), pattern, data } satisfies TcpMessage) +
      "\n";
    for (const socket of this.sockets) {
      socket.write(line);
    }
  }

  /** Destroys all sockets, rejects pending requests, and closes the server. */
  public close(): void {
    for (const socket of this.sockets) {
      socket.destroy();
    }
    this.sockets.clear();
    this.pendingReplies.clear();
    this.server?.close();
    this.isListening = false;
    this.cleanup();
  }
}
