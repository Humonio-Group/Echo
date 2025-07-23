import { protect } from "~/server/services/globals/protection";
import { createConversation } from "~/server/services/conversations/conversations";

export default defineEventHandler(async event => await protect(event, createConversation));
