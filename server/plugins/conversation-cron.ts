import { useScheduler } from "#scheduler";
import { propagateEndedConversations } from "~/server/services/conversations/conversations";

export default defineNitroPlugin(() => {
  const scheduler = useScheduler();

  scheduler.run(async () => {
    const count = await propagateEndedConversations();
    console.log(`[${new Date().toISOString()}] Ended conversations processed (${count})`);
  }).everySeconds(15);
});
