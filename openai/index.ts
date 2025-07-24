import OpenAI from "openai";
import type { IConversation } from "~/types/conversations";
import type { TNull } from "~/types/globals/utils";

export const gpt = new OpenAI({
  apiKey: process.env.NUXT_GPT_SECRET_KEY,
});

export async function generateAnswer(userId: string, conversation: IConversation): Promise<TNull<string>> {
  return (await gpt.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: replaceVariables(userId, conversation),
      },
    ],
  })).choices[0].message.content;
}

export function replaceVariables(userId: string, conversation: IConversation): string {
  const simulator = conversation.simulator;
  if (!simulator) throw new Error("simulator not found");

  let behavior = simulator.behaviorPrompt;
  const variables = gatherVariablesValue(userId, conversation);

  Object.keys(variables).forEach(key => behavior = behavior.replaceAll(`{{${key}}}`, variables[key]));

  console.log(behavior);
  return behavior;
}

export function gatherVariablesValue(userId: string, conversation: IConversation): { [key: string]: string } {
  const simulator = conversation.simulator;
  if (!simulator) throw new Error("simulator not found");

  const convHistory = conversation.messages?.map(msg => ({
    id: msg.id,
    sender: msg.sender,
    message: msg.content,
  })) ?? [];
  const companyInfo = conversation.workspace?.companyInfo ?? "";
  const companyPandS = conversation.workspace?.productOrService ?? "";
  const companyValues = conversation.workspace?.values ?? "";

  return {
    history: JSON.stringify(convHistory),
    company_info: companyInfo,
    company_pands: companyPandS,
    company_values: companyValues,
  };
}
