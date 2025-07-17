import { protect } from "~/server/services/globals/protection";
import { duplicateSimulator } from "~/server/services/simulators/simulators";

export default defineEventHandler(async e => await protect(e, duplicateSimulator));
