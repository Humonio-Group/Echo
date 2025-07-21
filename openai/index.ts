import OpenAI from "openai";

const gpt = new OpenAI({
  apiKey: process.env.NUXT_GPT_SECRET_KEY,
});
export default gpt;
