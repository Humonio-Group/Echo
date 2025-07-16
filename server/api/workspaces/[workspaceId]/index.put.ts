import { protect } from "~/server/services/globals/protection";
import { updateWorkspace } from "~/server/services/workspaces/workspaces";

export default defineEventHandler(async e => await protect(e, updateWorkspace));
