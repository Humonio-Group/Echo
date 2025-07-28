import { protect } from "~/server/services/globals/protection";
import { createSimulator } from "~/server/services/simulators/simulators";

export default defineEventHandler(async event => await protect(event, createSimulator));
