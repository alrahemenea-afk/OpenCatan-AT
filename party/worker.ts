import { Server, routePartykitRequest } from "partyserver";
import type { Connection, WSMessage } from "partyserver";
import { OpenCatanServer } from "./index";

type Env = { Game: DurableObjectNamespace<GameServer> };

interface ConnShim {
  id: string;
  playerId?: string;
  send: (message: string) => void;
  close: () => void;
}

export class GameServer extends Server<Env> {
  private shims = new Map<string, ConnShim>();
  private game: OpenCatanServer | null = null;

  private getGame(): OpenCatanServer {
    if (!this.game) {
      const room = {
        id: this.name,
        getConnections: () => Array.from(this.shims.values()),
      };
      this.game = new OpenCatanServer(room as never);
    }
    return this.game;
  }

  private shimFor(conn: Connection): ConnShim {
    let shim = this.shims.get(conn.id);
    if (!shim) {
      shim = {
        id: conn.id,
        send: (message: string) => {
          try {
            conn.send(message);
          } catch {
            // الاتصال مسكّر، نتجاهلو
          }
        },
        close: () => {
          try {
            conn.close();
          } catch {
            // مسكّر من قبل
          }
        },
      };
      this.shims.set(conn.id, shim);
    }
    return shim;
  }

  async onConnect(conn: Connection) {
    await this.getGame().onConnect(
      this.shimFor(conn) as never,
      undefined as never
    );
  }

  async onMessage(conn: Connection, message: WSMessage) {
    const text =
      typeof message === "string"
        ? message
        : new TextDecoder().decode(message);
    await this.getGame().onMessage(text, this.shimFor(conn) as never);
  }

  async onClose(conn: Connection) {
    const shim = this.shimFor(conn);
    await this.getGame().onClose(shim as never);
    this.shims.delete(conn.id);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return (
      (await routePartykitRequest(request, env)) ||
      new Response("Not Found", { status: 404 })
    );
  },
};