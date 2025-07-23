import type { HttpEvent } from "~/types/globals/http";
import { StatusCode } from "~/types/globals/http";
import * as conversations from "~/server/repositories/conversations";
import * as simulators from "~/server/repositories/simulators";
import { catchError, setOutput } from "~/server/services/globals/errors";
import type { EchoError } from "~/types/globals/errors";
import { EchoBadRequestError } from "~/types/globals/errors";
import type { IPrepAnswerCreate } from "~/types/conversations";

export async function createConversation(event: HttpEvent) {
  const user = event.context.user;
  const workspace = event.context.workspace;

  const simulatorId = getRouterParam(event, "simulatorId");
  if (!simulatorId) return catchError(event, new EchoBadRequestError("Missing simulator id"));

  const { answers } = await readBody<{
    answers: IPrepAnswerCreate[];
  }>(event);

  try {
    const simulator = await simulators.get(Number(simulatorId), workspace.id);
    const conversation = await conversations.create(user.id, workspace.id, simulator, answers);

    setOutput(event, StatusCode.CREATED, `Conversation "${conversation.uid}" created!`);
    return conversation;
  }
  catch (e) {
    return catchError(event, e as EchoError);
  }
}

export async function recoverUserConversations(event: HttpEvent) {
  const user = event.context.user;
  const workspace = event.context.workspace;

  try {
    const convs = await conversations.getAll(user.id, workspace.id);
    setOutput(event, convs.length ? StatusCode.OK : StatusCode.NO_CONTENT);
    return convs;
  }
  catch (e) {
    return catchError(event, e as EchoError);
  }
}
