import * as assessments from "~/server/repositories/assessments";
import type { IAssessment, IAssessments, IConversation, IMessages } from "~/types/conversations";
import type { IEvaluation } from "~/types/simulators";
import type { TNull } from "~/types/globals/utils";
import { generate } from "~/openai";
import { TEXT_RESULT_BUILDER_PROMPT, GRAPH_BUILDING_PROMPT, replaceVariables } from "~/openai/prompts";
import { gatherPrepAnswersForReplacement } from "~/server/services/conversations/conversations";

export const formatMessages = (messages: IMessages): string => messages
  .map(msg => ({
    sender: msg.sender,
    message: msg.content,
  }))
  .map(msg => `${["ia", "ai"].includes(msg.sender.toLowerCase()) ? "SIMULATOR" : "USER"} - ${msg.message}`)
  .join("\n") ?? "";

export async function generateConversationResults(conversation: IConversation): Promise<IAssessments> {
  const evaluations = conversation.simulator?.evaluations ?? [];
  const assessments: IAssessments = [];

  for (const evaluation of evaluations)
    assessments.push(await generateEvaluation(conversation, evaluation));
  return assessments;
}

export async function generateEvaluation(conversation: IConversation, evaluation: IEvaluation): Promise<IAssessment> {
  const type = evaluation.type;
  switch (type) {
    case "text": {
      return await assessments.create(conversation.uid, {
        evaluationKey: evaluation.key,
        type,
        data: "",
        debrief: await generateTextResult(conversation, evaluation) ?? "",
      });
    }

    case "graph": {
      return await assessments.create(conversation.uid, {
        evaluationKey: evaluation.key,
        type,
        data: await generateGraphResult(conversation, evaluation) ?? "",
        debrief: "",
      });
    }
  }
}

export async function generateGraphResult(conversation: IConversation, evaluation: IEvaluation): Promise<TNull<string>> {
  return await generate(replaceVariables(conversation.workspace?.graphGenerationPrompt || GRAPH_BUILDING_PROMPT, {
    conversation_history: formatMessages(conversation.messages ?? []),
    framework_prompt: evaluation.frameworkPrompt ?? "",
    evaluation_axes: evaluation.assessmentPrompt ?? "",
    max_value: "10",
    ...gatherPrepAnswersForReplacement(conversation),
    company_info: conversation.workspace?.companyInfo ?? "",
    company_pands: conversation.workspace?.productOrService ?? "",
    company_values: conversation.workspace?.values ?? "",
    prep_answers: (conversation.answers ?? []).map(a => `${a.prepQuestion?.label} -> ${a.answer}`).join("\n"),
  }));
}

export async function generateTextResult(conversation: IConversation, evaluation: IEvaluation): Promise<TNull<string>> {
  return await generate(replaceVariables(conversation.workspace?.textualGenerationPrompt || TEXT_RESULT_BUILDER_PROMPT, {
    conversation_history: formatMessages(conversation.messages ?? []),
    framework_prompt: replaceVariables(evaluation.frameworkPrompt ?? "", gatherPrepAnswersForReplacement(conversation)),
    feedback_prompt: replaceVariables(evaluation.feedbackPrompt ?? "", gatherPrepAnswersForReplacement(conversation)),
    ...gatherPrepAnswersForReplacement(conversation),
    prep_answers: (conversation.answers ?? []).map(a => `${a.prepQuestion?.label} -> ${a.answer}`).join("\n"),
    company_info: conversation.workspace?.companyInfo ?? "",
    company_pands: conversation.workspace?.productOrService ?? "",
    company_values: conversation.workspace?.values ?? "",
  }));
}
