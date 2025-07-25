import * as assessments from "~/server/repositories/assessments";
import type { IAssessment, IAssessments, IConversation } from "~/types/conversations";
import type { IEvaluation } from "~/types/simulators";
import type { TNull } from "~/types/globals/utils";
import { generate } from "~/openai";

const messages = (conversation: IConversation): string => JSON.stringify(conversation.messages?.map(msg => ({
  id: msg.id,
  sender: msg.sender,
  message: msg.content,
})) ?? []);
const variables = (conversation: IConversation, evaluation: IEvaluation, injected?: {
  assessment: string;
}): { [key: string]: string } => {
  const history = messages(conversation);
  const compInfo = conversation.workspace?.companyInfo ?? "";
  const compPandS = conversation.workspace?.productOrService ?? "";
  const compValues = conversation.workspace?.values ?? "";
  const assessment = injected?.assessment ?? "";
  const framework = evaluation.frameworkPrompt;

  return {
    history,
    companyInfo: compInfo,
    companyPandS: compPandS,
    companyValues: compValues,
    assessment,
    framework,
  };
};

function replaceVariables(prompt: string, options: {
  conversation: IConversation;
  evaluation: IEvaluation;
  assessment: string;
}) {
  const vars = variables(options.conversation, options.evaluation, { assessment: options.assessment });
  Object.keys(vars).forEach(v => prompt = prompt.replaceAll(`{{${v}}`, vars[v]));
  return prompt;
}

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
  return generate(replaceVariables(evaluation.assessmentPrompt, {
    conversation,
    evaluation,
    assessment: "",
  }));
}

export async function generateDebrief(conversation: IConversation, evaluation: IEvaluation, assessment: TNull<string>): Promise<TNull<string>> {
  return generate(replaceVariables(evaluation.feedbackPrompt, {
    conversation,
    evaluation,
    assessment: assessment ?? "",
  }));
}
