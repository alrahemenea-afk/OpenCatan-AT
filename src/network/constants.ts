/**
 * Network constants for OpenCatan
 */

/**
 * Game server host.
 * - If VITE_PARTYKIT_HOST is set, it is used.
 * - In production the game server runs in the same Cloudflare Worker as the
 *   website, so we use the current page host.
 * - In development we use localhost:1999.
 */
export const PARTYKIT_HOST =
  import.meta.env.VITE_PARTYKIT_HOST ||
  (process.env.NODE_ENV === 'production' && typeof window !== 'undefined'
    ? window.location.host
    : 'localhost:1999');

/**
 * PartyKit party name for the game
 */
export const PARTYKIT_PARTY = 'game';

/**
 * Connection timeouts and intervals
 */
export const CONNECTION_TIMEOUT_MS = 10000; // 10 seconds
export const PING_INTERVAL_MS = 30000; // 30 seconds
export const MAX_RECONNECT_ATTEMPTS = 10;
export const RECONNECT_BASE_DELAY_MS = 1000; // 1 second
export const RECONNECT_MAX_DELAY_MS = 30000; // 30 seconds

/**
 * Player timeout for disconnection before being removed from game
 */
export const PLAYER_DISCONNECT_TIMEOUT_MS = 60000; // 1 minute

/**
 * State synchronization
 */
export const STATE_SYNC_INTERVAL_MS = 1000; // 1 second
export const PENDING_ACTION_TIMEOUT_MS = 5000; // 5 seconds

/**
 * Room code configuration
 * Note: Only letters (no numbers) for cleaner URLs at /:code
 */
export const ROOM_CODE_LENGTH = 6;
export const ROOM_CODE_CHARACTERS = 'ABCDEFGHJKMNPQRSTUVWXYZ';
export const ROOM_EXPIRATION_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Generate a random room code
 */
export function generateRoomCode(): string {
  let code = '';
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    code += ROOM_CODE_CHARACTERS.charAt(
      Math.floor(Math.random() * ROOM_CODE_CHARACTERS.length)
    );
  }
  return code;
}