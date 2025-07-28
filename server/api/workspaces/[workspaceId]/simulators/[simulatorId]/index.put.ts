import { protect } from "~/server/services/globals/protection";
import { saveSimulator } from "~/server/services/simulators/simulators";

export default defineEventHandler(async event => await protect(event, saveSimulator));
