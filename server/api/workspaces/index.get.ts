export default defineEventHandler((event) => {
  event.node.res.statusCode = 501;
  event.node.res.statusMessage = "Not implemented yet.";

  return;
});
