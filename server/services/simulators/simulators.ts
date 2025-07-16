import type { HttpEvent } from "~/types/globals/http";
import { StatusCode } from "~/types/globals/http";
import * as simulators from "~/server/repositories/simulators";
import type { ISimulatorCreate } from "~/types/simulators";
import { catchError, setOutput } from "~/server/services/globals/errors";
import type { EchoError } from "~/types/globals/errors";

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
