import type { TArray, TNull } from "~/types/globals/utils";
import type { IWorkspace } from "~/types/workspaces";

export interface ISimulator {
  id: number;
  workspaceId?: TNull<number>;
  title: string;
  description: string;
  picture: TNull<string>;
  duration: number;
  behaviorPrompt: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;

  workspace?: TNull<IWorkspace>;

  prepQuestions?: TArray<IPrepQuestion>;
  evaluations?: TArray<IEvaluation>;
}
export type ISimulatorCreate = Omit<ISimulator, "id" | "workspaceId" | "createdBy" | "createdAt" | "updatedAt" | "workspace" | "prepQuestions" | "evaluations"> & {
  prepQuestions?: TArray<IPrepQuestionCreate>;
  evaluations?: TArray<IEvaluationCreate>;
};
export type ISimulatorUpdate = Pick<ISimulator, "title" | "description" | "duration" | "picture" | "behaviorPrompt"> & {
  questionsToDelete?: TArray<string>;
  evaluationsToDelete?: TArray<string>;
  prepQuestions?: TArray<IPrepQuestionUpdate>;
  evaluations?: TArray<IEvaluationUpdate>;
};

export interface IPrepQuestion {
  id: number;
  key: string;
  simulatorId: number;
  label: string;

  simulator?: ISimulator;
}
export type IPrepQuestionCreate = Omit<IPrepQuestion, "id" | "simulatorId" | "simulator" | "key">;
export type IPrepQuestionUpdate = Pick<IPrepQuestion, "label"> & { key?: string };

export interface IEvaluation {
  id: number;
  key: string;
  simulatorId: number;
  frameworkPrompt: string;
  assessmentPrompt: string;
  feedbackPrompt: string;
  maxValue: number;

  simulator?: ISimulator;
}
export type IEvaluationCreate = Omit<IEvaluation, "id" | "simulatorId" | "simulator" | "key">;
export type IEvaluationUpdate = Pick<IEvaluation, "frameworkPrompt" | "assessmentPrompt" | "feedbackPrompt"> & { key?: string };
