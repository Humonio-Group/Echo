import type { TNull } from "~/types/globals/utils";
import type { IConversation } from "~/types/conversations";

export enum EventType {
  JOIN = "join",
  JOINED = "joined",
  LEAVE = "leave",
  MESSAGE = "message",
  STOP_REQUEST = "stop-request",
}

export interface PeerData {
  room: TNull<string>;
  userId?: string;
}

export interface WSEvent {
  type: EventType;
  room: string;
}

export interface WSJoinEvent extends WSEvent {
  type: EventType.JOIN;
}
export interface WSJoinedEvent extends WSEvent {
  type: EventType.JOINED;
  conversation: IConversation;
}
export interface WSLeaveEvent extends WSEvent {
  type: EventType.LEAVE;
}
export interface WSMessageEvent extends WSEvent {
  type: EventType.MESSAGE;
  message: string;
  sender: string;
}
