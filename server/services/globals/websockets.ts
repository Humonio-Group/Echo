/* eslint-disable */
import {EventType, WSEvent, WSMessageEvent} from "~/types/globals/websocket";

const rooms = new Map<string, Set<any>>();

export function join(peer: any, room: string) {
  leave(peer);
  peer.context.data.room = room;
  if (!rooms.has(room)) rooms.set(room, new Set());
  rooms.get(room)!.add(peer);
}

export function leave(peer: any) {
  const room = peer.context.data.room;
  if (!room) return;

  const set = rooms.get(room);
  if (set) {
    set.delete(peer);
    if (!set.size) rooms.delete(room);
  }

  peer.context.data.room = null;
}

export function broadcast(room: string, payload: WSEvent, except?: any) {
  const set = rooms.get(room);
  if (!set) return;

  const msg = JSON.stringify(payload);
  for (const p of set) {
    if (except && p === except) continue;
    p.send(msg);
  }
}

export function handleMessage(peer: any, data: WSEvent) {
  switch (data.type) {
    case EventType.JOIN: {
      join(peer, data.room);
      break;
    }

    case EventType.LEAVE: {
      leave(peer);
      break;
    }

    case EventType.MESSAGE: {
      setTimeout(() => broadcast(data.room, {
          type: EventType.MESSAGE,
          room: data.room,
          sender: "ia",
          message: (data as WSMessageEvent).message, // TODO: replace by ai response
        } as WSMessageEvent), 750);
      break;
    }

    default: {
      console.warn(`[WS] (${data.type}) Method not implemented.`);
      break;
    }
  }
}