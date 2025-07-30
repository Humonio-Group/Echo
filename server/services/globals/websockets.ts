/* eslint-disable */
import {
  EventType, WSConversationAssessmentsGeneratedEvent,
  WSConversationEndedEvent,
  type WSConversationStopRequestEvent,
  WSEvent,
  WSMessageEvent
} from "~/types/globals/websocket";
import { generate } from "~/openai";
import * as conversations from "~/server/repositories/conversations";
import {formatMessages, generateConversationResults} from "~/server/services/conversations/assessments";
import { conversationalPrompt, replaceVariables } from "~/openai/prompts";
import { IMessages } from "~/types/conversations";
import {gatherPrepAnswersForReplacement} from "~/server/services/conversations/conversations";

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

  const msg = JSON.stringify({
    ...payload,
    room,
  });
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

      const generated = await conversations.message(
        data.room,
        "ai",
        await generate(replaceVariables(conversationalPrompt, {
          "user_prompt": replaceVariables(conv.simulator?.behaviorPrompt ?? "", gatherPrepAnswersForReplacement(conv)),
          "conversation_history": formatMessages(conv.messages ?? []),
        })) ?? "empty-message",
      );
      broadcast(data.room, {
        type: EventType.MESSAGE,
        room: data.room,
        sender: generated.sender,
        message: generated.content,
      } as WSMessageEvent);
      break;
    }

    case EventType.LEAVE: {
      leave(peer);
      break;
    }

    case EventType.MESSAGE: {
      const payload = data as WSMessageEvent;
      const sent = await conversations.message(payload.room, payload.sender, payload.message);
      const conv = await conversations.get(data.room);

      broadcast(data.room, {
        type: EventType.MESSAGE,
        room: data.room,
        sender: sent.sender,
        message: sent.content,
      } as WSMessageEvent, peer);

      const generated = await conversations.message(
        payload.room,
        "ai",
        await generate(replaceVariables(conversationalPrompt, {
          "user_prompt": replaceVariables(conv.simulator?.behaviorPrompt ?? "", gatherPrepAnswersForReplacement(conv)),
          "conversation_history": formatMessages(conv.messages ?? []),
        })) ?? "empty-message",
      );

      broadcast(data.room, {
        type: EventType.MESSAGE,
        room: data.room,
        sender: generated.sender,
        message: generated.content,
      } as WSMessageEvent);
      break;
    }

    case EventType.STOP_REQUEST: {
      const payload = data as WSConversationStopRequestEvent;

      const conv = await conversations.end(payload.room, new Date(payload.emittedAt));
      broadcast(payload.room, {
        type: EventType.CONV_ENDED,
        endedAt: conv.stoppedAt,
      } as WSConversationEndedEvent);

      const assessments = await generateConversationResults(conv);
      broadcast(payload.room, {
        type: EventType.ASSESSMENTS_GENERATED,
        assessments,
      } as WSConversationAssessmentsGeneratedEvent);
      break;
    }

    default: {
      console.warn(`[WS] (${data.type}) Method not implemented.`);
      break;
    }
  }
}
