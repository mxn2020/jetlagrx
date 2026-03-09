import { action } from "./_generated/server";
import { v } from "convex/values";
export const generateProtocol = action({
    args: { origin: v.string(), destination: v.string(), departureTime: v.string(), arrivalTime: v.string() },
    handler: async (_ctx, args) => {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error("OPENAI_API_KEY not configured");
        const r = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: "gpt-4o", messages: [
                    {
                        role: "system", content: `You are JetLagRx, a sleep scientist and travel medicine expert. Generate a personalized jet lag recovery protocol based on flight details. Consider timezone differences, circadian rhythm, light exposure, caffeine timing, and melatonin. Output JSON:
{"origin":"","destination":"","severity":"mild|moderate|severe","schedule":[{"time":"<HH:MM local>","action":"<what to do>","reason":"<why>"}],"tips":["tip1","tip2"]}` },
                    { role: "user", content: `Flying from ${args.origin} to ${args.destination}. Departure: ${args.departureTime}, Arrival: ${args.arrivalTime}` },
                ], temperature: 0.4, max_tokens: 2000, response_format: { type: "json_object" }
            }),
        });
        if (!r.ok) throw new Error(`API error`);
        return JSON.parse((await r.json() as any).choices?.[0]?.message?.content ?? "{}");
    },
});
