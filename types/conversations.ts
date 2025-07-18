import type { TArray } from "~/types/globals/utils";
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
  userId: string;
  startedAt: Date;
  stoppedAt: Date;

  simulator?: ISimulator;
  workspace?: IWorkspace;

  answers?: IPrepAnswers;
  messages?: IMessages;
  assessments?: IAssessments;
}
export type IConversationCreate = Omit<IConversation, "uid" | "workspaceId" | "userId" | "startedAt" | "stoppedAt" | "simulator" | "workspace" | "answers" | "messages" | "assessments">;

export interface IPrepAnswer {
  id: number;
  prepQuestionKey: string;
  conversationUid: string;
  answer: string;

  prepQuestion?: IPrepQuestion;
  conversation?: IConversation;
}
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
