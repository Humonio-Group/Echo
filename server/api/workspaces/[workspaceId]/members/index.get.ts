import { protect } from "~/server/services/globals/protection";
import { recoverWorkspaceMembers } from "~/server/services/workspaces/members";

export default defineEventHandler(async event => await protect(event, recoverWorkspaceMembers, true));
