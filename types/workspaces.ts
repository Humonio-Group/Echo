import type { TArray, TNull } from "~/types/globals/utils";
import type { ISimulator } from "~/types/simulators";

export const roles = [
  "member",
  "admin",
  "observer",
] as const;
export type ERole = typeof roles[number];

export interface IWorkspace {
  id: number;
  name: string;
  description: TNull<string>;
  picture: TNull<string>;
  companyInfo: string;
  productOrService: string;
  values: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;

  members?: TArray<IWorkspaceMember>;
  simulators?: TArray<ISimulator>;
}
export type IWorkspaceCreate = Omit<IWorkspace, "id" | "picture" | "ownerId" | "companyInfo" | "productOrService" | "values" | "createdAt" | "updatedAt" | "members" | "simulators">;
export type IWorkspaceUpdate = Partial<Omit<IWorkspace, "id" | "picture" | "ownerId" | "createdAt" | "updatedAt" | "members" | "simulators">>;

export interface IWorkspaceMember {
  workspaceId: number;
  userId: string;
  role: ERole;
  createdAt: Date;
  updatedAt: Date;

  workspace?: IWorkspace;
}
export type IWorkspaceMemberKey = Pick<IWorkspaceMember, "workspaceId" | "userId">;
