import { google } from "@ai-sdk/google";
import { start } from "workflow/api";
import { generate } from "./generate/generate";

export const dynamic = "force-dynamic"

export default async function Page() {
  const batches = (await google.languageModel("gemini-2.5-flash-lite").doListBatches?.()) || []

  async function generateAction() {
    "use server";

    await start(generate);
  }

  return (
    <div>
      <h1>Batches: {batches.length}</h1>
      {batches.map(batch => {
        return <div><h4>{batch.id}</h4></div>
      })}
      <form action={generateAction}>
        <button type="submit">Create Batch</button>
      </form>
    </div>
  );
}