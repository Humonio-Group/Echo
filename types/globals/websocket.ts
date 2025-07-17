import type { TNull } from "~/types/globals/utils";

export enum EventType {
  JOIN = "join",
  LEAVE = "leave",
  MESSAGE = "message",
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
export interface WSLeaveEvent extends WSEvent {
  type: EventType.LEAVE;
}
export interface WSMessageEvent extends WSEvent {
  type: EventType.MESSAGE;
  message: string;
  sender: string;
}
