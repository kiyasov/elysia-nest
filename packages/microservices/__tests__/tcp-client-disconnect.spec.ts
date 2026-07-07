import { createServer, type Server as NetServer, type Socket } from "net";

import { afterEach, describe, expect, it } from "bun:test";

import { TcpClient } from "../src/client/tcp.client";

/**
 * MS8 regression: when the socket disconnects with in-flight requests, the
 * pending requests must be rejected promptly (with their timers cleared)
 * instead of hanging for the full 5s request timeout.
 */
describe("TcpClient — MS8 in-flight rejection on disconnect", () => {
  let netServer: NetServer | undefined;
  let client: TcpClient | undefined;
  const held: Socket[] = [];

  afterEach(() => {
    client?.close();
    for (const s of held) s.destroy();
    held.length = 0;
    netServer?.close();
  });

  it("rejects an in-flight request when the socket is destroyed", async () => {
    // Server that accepts connections but never replies.
    netServer = createServer((socket) => held.push(socket));
    const port = await new Promise<number>((resolve) => {
      netServer!.listen(0, "127.0.0.1", () => {
        resolve((netServer!.address() as { port: number }).port);
      });
    });

    client = new TcpClient({ host: "127.0.0.1", port });
    await client.connect();

    const outcome = await new Promise<"rejected" | "resolved" | "hang">(
      (resolve) => {
        const guard = setTimeout(() => resolve("hang"), 1000);
        client!.send("noop", { x: 1 }).subscribe({
          next: () => {
            clearTimeout(guard);
            resolve("resolved");
          },
          error: () => {
            clearTimeout(guard);
            resolve("rejected");
          },
        });

        // Drop the connection while the request is in flight.
        setTimeout(() => {
          (client as unknown as { socket: Socket }).socket.destroy();
        }, 20);
      },
    );

    expect(outcome).toBe("rejected");
  });
});
