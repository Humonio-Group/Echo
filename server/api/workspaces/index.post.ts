import { protect } from "~/server/services/globals/protection";
import { createWorkspace } from "~/server/services/workspaces/workspaces";

export default defineEventHandler(async e =>
  await protect(e, async event =>
    await createWorkspace(event)));
