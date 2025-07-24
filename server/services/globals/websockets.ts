/* eslint-disable */
import {EventType, WSEvent, WSMessageEvent} from "~/types/globals/websocket";
import gpt from "~/openai";
import * as conversations from "~/server/repositories/conversations";
import conversation from "~/openai/prompts/conversation";

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

export async function handleMessage(peer: any, data: WSEvent) {
  switch (data.type) {
    case EventType.JOIN: {
      join(peer, data.room);

      const conv = await conversations.get(data.room);
      peer.send({
        type: EventType.JOINED,
        room: data.room,
        conversation: conv,
      });

      if (conv.messages?.[conv.messages?.length - 1]?.sender === "ai") break;
      const message = (await gpt.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: conversation.replace("{{HISTORIQUE_CONVERSATION}}", ""),
          }
        ]
      })).choices[0].message.content;
      await conversations.message(data.room, "ai", message ?? "empty-message");
      broadcast(data.room, {
        type: EventType.MESSAGE,
        room: data.room,
        sender: "ai",
        message,
      } as WSMessageEvent);
      break;
    }

    case EventType.LEAVE: {
      leave(peer);
      break;
    }

    case EventType.MESSAGE: {
      const payload = data as WSMessageEvent;
      await conversations.message(payload.room, payload.sender, payload.message);
      const conv = await conversations.get(data.room);

      broadcast(data.room, {
        type: EventType.MESSAGE,
        room: data.room,
        sender: payload.sender,
        message: payload.message,
      } as WSMessageEvent, peer);

      const aiAnswer = (await gpt.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: conversation.replace("{{HISTORIQUE_CONVERSATION}}", JSON.stringify(conv.messages?.map(m => ({ sender: m.sender, content: m.content })) ?? [])),
          }
        ]
      })).choices[0].message.content;
      await conversations.message(payload.room, "ai", aiAnswer ?? "empty-message");
      broadcast(data.room, {
        type: EventType.MESSAGE,
        room: data.room,
        sender: "ai",
        message: aiAnswer,
      } as WSMessageEvent);
      break;
    }

    case EventType.STOP_REQUEST: {
      console.log(data.room);
      break;
    }

    default: {
      console.warn(`[WS] (${data.type}) Method not implemented.`);
      break;
    }
  }
}
