import type { HttpEvent } from "~/types/globals/http";
import { StatusCode } from "~/types/globals/http";
import * as simulators from "~/server/repositories/simulators";
import type { ISimulatorCreate, ISimulatorUpdate } from "~/types/simulators";
import { catchError, setOutput } from "~/server/services/globals/errors";
import type { EchoError } from "~/types/globals/errors";
import { EchoBadRequestError } from "~/types/globals/errors";

export async function createSimulator(event: HttpEvent) {
  const user = event.context.user;
  const workspace = event.context.workspace;
  const body = await readBody<ISimulatorCreate>(event);

  try {
    const simulator = await simulators.create(user.id, workspace.id, body);

    setOutput(event, StatusCode.CREATED, `Simulator ${simulator.id} has been created for ${workspace.name}`);
    return simulator;
  }
  catch (e) {
    return catchError(event, e as EchoError);
  }
}

export async function saveSimulator(event: HttpEvent) {
  const body = await readBody<ISimulatorUpdate>(event);
  const simulatorId = getRouterParam(event, "simulatorId");

  if (!simulatorId) return catchError(event, new EchoBadRequestError("Simulator id is missing."));

  try {
    for (const question of body.questionsToDelete ?? [])
      await simulators.deleteQuestion(question);
    for (const evaluation of body.evaluationsToDelete ?? [])
      await simulators.deleteEvaluation(evaluation);

    for (const question of body.prepQuestions ?? [])
      if (question.key) await simulators.updateQuestion(question.key, question);
      else await simulators.createQuestion(Number(simulatorId), question);
    for (const evaluation of body.evaluations ?? [])
      if (evaluation.key) await simulators.updateEvaluation(evaluation.key, evaluation);
      else await simulators.createEvaluation(Number(simulatorId), evaluation);

    const simulator = await simulators.update(Number(simulatorId), body);

    setOutput(event, StatusCode.ACCEPTED, `Simulator ${simulator.id} has been updated`);
    return simulator;
  }
  catch (e) {
    return catchError(event, e as EchoError);
  }
}

export async function duplicateSimulator(event: HttpEvent) {
  const user = event.context.user;
  const workspace = event.context.workspace;
  const { simulatorId } = await readBody<{ simulatorId: number }>(event);

  if (!simulatorId) return catchError(event, new EchoBadRequestError("Missing simulator id"));

  try {
    const { title, description, picture, duration, behaviorPrompt, prepQuestions, evaluations } = await simulators.get(Number(simulatorId));
    const simulator = await simulators.create(user.id, workspace.id, {
      title,
      description,
      picture,
      duration,
      behaviorPrompt,
      prepQuestions: prepQuestions?.map(p => ({
        id: p.id,
        label: p.label,
      })) ?? [],
      evaluations: evaluations?.map(e => ({
        id: e.id,
        frameworkPrompt: e.frameworkPrompt,
        assessmentPrompt: e.assessmentPrompt,
        feedbackPrompt: e.feedbackPrompt,
        maxValue: e.maxValue,
      })) ?? [],
    });

    setOutput(event, StatusCode.CREATED, `Simulator ${simulatorId} duplicated in ${workspace.name}`);
    return simulator;
  }
  catch (e) {
    console.error(e);
    return catchError(event, e as EchoError);
  }
}

export async function deleteSimulator(event: HttpEvent) {
  const simulatorId = getRouterParam(event, "simulatorId");

  if (!simulatorId) return catchError(event, new EchoBadRequestError("Simulator id is missing."));

  try {
    const simulator = await simulators.destroy(Number(simulatorId));

    setOutput(event, StatusCode.ACCEPTED, `Simulator ${simulator.id} has been deleted`);
    return simulator;
  }
  catch (e) {
    return catchError(event, e as EchoError);
  }
}

export async function getWorkspaceLibrary(event: HttpEvent) {
  try {
    return await simulators.getPublicLibrary();
  }
  catch (e) {
    console.error(e);
    return catchError(event, e as EchoError);
  }
}
