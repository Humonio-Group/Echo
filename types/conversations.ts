import type { TArray, TNull } from "~/types/globals/utils";
import type { IEvaluation, IPrepQuestion, ISimulator } from "~/types/simulators";
import type { IWorkspace } from "~/types/workspaces";

export const assessmentTypes = [
  "text",
  "graph",
] as const;
export type EAssessmentType = typeof assessmentTypes[number];

export interface IConversation {
  uid: string;
  simulatorId: number;
  workspaceId: number;
  name: string;
  userId: string;
  startedAt: Date;
  stoppedAt: Date;
  processedAt?: TNull<Date>;

  simulator?: ISimulator;
  workspace?: IWorkspace;

  answers?: IPrepAnswers;
  messages?: IMessages;
  assessments?: IAssessments;
}

export interface IPrepAnswer {
  id: number;
  prepQuestionKey: string;
  conversationUid: string;
  answer: string;

  prepQuestion?: IPrepQuestion;
  conversation?: IConversation;
}
export type IPrepAnswerCreate = Omit<IPrepAnswer, "id" | "conversationUid" | "prepQuestion" | "conversation">;
export type IPrepAnswers = TArray<IPrepAnswer>;

export interface IAssessment {
  id: number;
  conversationUid: string;
  evaluationKey: string;
  type: EAssessmentType;
  data: string;
  debrief: string;
  createdAt: Date;

  conversation?: IConversation;
  evaluation?: IEvaluation;
}
export type IAssessmentCreate = Omit<IAssessment, "id" | "conversationUid" | "createdAt" | "conversation" | "evaluation">;
export type IAssessments = TArray<IAssessment>;

export interface IMessage {
  id: number;
  conversationUid: string;
  sender: string;
  content: string;
  sentAt: Date;

  conversation?: IConversation;
}
export type IMessages = TArray<IMessage>;
