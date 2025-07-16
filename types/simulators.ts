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

export interface IPrepQuestion {
  id: number;
  simulatorId: number;
  label: string;

  simulator?: ISimulator;
}
export type IPrepQuestionCreate = Omit<IPrepQuestion, "simulatorId" | "simulator">;

export interface IEvaluation {
  id: number;
  simulatorId: number;
  frameworkPrompt: string;
  assessmentPrompt: string;
  feedbackPrompt: string;

  simulator?: ISimulator;
}
export type IEvaluationCreate = Omit<IEvaluation, "simulatorId" | "simulator">;
