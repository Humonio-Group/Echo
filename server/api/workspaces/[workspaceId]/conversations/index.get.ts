import { protect } from "~/server/services/globals/protection";
import { recoverUserConversations } from "~/server/services/conversations/conversations";

export default defineEventHandler(async event => await protect(event, recoverUserConversations));
