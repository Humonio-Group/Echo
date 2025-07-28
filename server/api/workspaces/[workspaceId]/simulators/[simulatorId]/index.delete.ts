import { protect } from "~/server/services/globals/protection";
import { deleteSimulator } from "~/server/services/simulators/simulators";

export default defineEventHandler(async event => await protect(event, deleteSimulator));
