import * as assessments from "~/server/repositories/assessments";
import type { IAssessment, IAssessments, IConversation, IMessages } from "~/types/conversations";
import type { IEvaluation } from "~/types/simulators";
import type { TNull } from "~/types/globals/utils";
import { generate } from "~/openai";
import { assessmentPrompt, debriefPrompt, replaceVariables } from "~/openai/prompts";
import { gatherPrepAnswersForReplacement } from "~/server/services/conversations/conversations";

export const formatMessages = (messages: IMessages): string => messages
  .map(msg => ({
    sender: msg.sender,
    message: msg.content,
  }))
  .map(msg => `${msg.sender} -- ${msg.message}`)
  .join("\n") ?? "";

export async function generateConversationResults(conversation: IConversation): Promise<IAssessments> {
  const evaluations = conversation.simulator?.evaluations ?? [];
  const assessments: IAssessments = [];

  for (const evaluation of evaluations) assessments.push(await generateEvaluation(conversation, evaluation));
  return assessments;
}

export async function generateEvaluation(conversation: IConversation, evaluation: IEvaluation): Promise<IAssessment> {
  const assessment = await generateAssessment(conversation, evaluation);
  const debrief = await generateDebrief(conversation, evaluation, assessment);

  return await assessments.create(conversation.uid, {
    evaluationKey: evaluation.key,
    type: "graph",
    data: assessment ?? "",
    debrief: debrief ?? "",
  });
}

export async function generateAssessment(conversation: IConversation, evaluation: IEvaluation): Promise<TNull<string>> {
  return generate(replaceVariables(assessmentPrompt, {
    conversation_history: formatMessages(conversation.messages ?? []),
    evaluation_axes: replaceVariables(evaluation.assessmentPrompt ?? "", gatherPrepAnswersForReplacement(conversation)),
  }));
}

export async function generateDebrief(conversation: IConversation, evaluation: IEvaluation, assessment: TNull<string>): Promise<TNull<string>> {
  return generate(replaceVariables(debriefPrompt, {
    conversation_history: formatMessages(conversation.messages ?? []),
    evaluation_result: replaceVariables(assessment ?? "", gatherPrepAnswersForReplacement(conversation)),
  }));
}
