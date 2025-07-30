import { protect } from "~/server/services/globals/protection";
import { createMemberAccess } from "~/server/services/workspaces/members";

export default defineEventHandler(async event => await protect(event, createMemberAccess, true));
