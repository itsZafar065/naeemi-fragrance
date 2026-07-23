import Pusher from "pusher";
import PusherClient from "pusher-js";

const appId = process.env.PUSHER_APP_ID;
const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
const secret = process.env.PUSHER_SECRET;
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

// Server-side Pusher instance
let pusherServerInstance: Pusher | null = null;

if (appId && key && secret && cluster) {
  pusherServerInstance = new Pusher({
    appId,
    key,
    secret,
    cluster,
    useTLS: true,
  });
}

export const getPusherServer = () => pusherServerInstance;

// Client-side Pusher instance
let pusherClientInstance: PusherClient | null = null;

export const getPusherClient = (): PusherClient | null => {
  if (typeof window === "undefined") return null;
  
  if (!pusherClientInstance && key && cluster) {
    pusherClientInstance = new PusherClient(key, {
      cluster,
    });
  }
  return pusherClientInstance;
};
