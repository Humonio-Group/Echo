import { protect } from "~/server/services/globals/protection";
import { recoverConversation } from "~/server/services/conversations/conversations";

export default defineEventHandler(async event => await protect(event, recoverConversation));
