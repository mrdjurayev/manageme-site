import "server-only";

import OpenAI from "openai";

import { getServerEnv } from "@/lib/env/server";

export const openai = new OpenAI({
  apiKey: getServerEnv("OPENAI_API_KEY"),
});
