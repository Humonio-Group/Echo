import type { HttpEvent } from "~/types/globals/http";
import { StatusCode } from "~/types/globals/http";
import * as simulators from "~/server/repositories/simulators";
import type { ISimulatorCreate } from "~/types/simulators";
import { catchError, setOutput } from "~/server/services/globals/errors";
import type { EchoError } from "~/types/globals/errors";
import { EchoBadRequestError } from "~/types/globals/errors";

export async function createSimulator(event: HttpEvent) {
  const user = event.context.user;
  const workspace = event.context.workspace;
  const body = await readBody<ISimulatorCreate>(event);

  try {
    const simulator = await simulators.create(user.id, workspace.id, body);

    setOutput(event, StatusCode.CREATED, `Simulator ${simulator.title} has been created for ${workspace.name}`);
    return simulator;
  }
  catch (e) {
    return catchError(event, e as EchoError);
  }
}

export async function duplicateSimulator(event: HttpEvent) {
  const user = event.context.user;
  const workspace = event.context.workspace;
  const simulatorId = getRouterParam(event, "simulatorId");

  if (!simulatorId) return catchError(event, new EchoBadRequestError("Missing simulator id"));

  try {
    const { title, description, picture, duration, behaviorPrompt } = await simulators.get(Number(simulatorId));
    const simulator = await simulators.create(user.id, workspace.id, {
      title,
      description,
      picture,
      duration,
      behaviorPrompt,
    });

    setOutput(event, StatusCode.CREATED, `Simulator ${simulatorId} duplicated in ${workspace.name}`);
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
