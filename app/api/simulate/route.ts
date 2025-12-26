import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const body = await req.json();
    const { companyName, industry, context, options } = body;

    // Use Flash for speed, but High Temperature for creative Game Theory
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json", temperature: 0.8 } 
    });

    const prompt = `
      You are the "Strategic Digital Twin" for ${companyName}.
      
      ROLE:
      Act as a Game Theory Engine. Treat competitors as rational, resource-bounded, and strategically selfish agents.
      
      INPUT:
      Context: ${context}
      Options: ${options}

      TASKS:
      1. ANALYZE COMPETITORS: Identify the primary competitor and their "Dominant Strategy".
      2. GENERATE STRATEGIES: Create 3 scenarios.
      3. RISK MATRIX: For each scenario, assign specific High/Medium/Low levels to Financial, Legal, Market, and Brand risks.

      OUTPUT JSON SCHEMA:
      {
        "twin_status": "Synced with Live Market Model",
        "competitor_profile": {
           "name": "String",
           "archetype": "String",
           "likely_counter_move": "String",
           "threat_level": "High | Critical | Moderate"
        },
        "scenarios": [
          {
            "id": "1",
            "title": "String",
            "outcome_3m": "String",
            "outcome_12m": "String",
            "risk_score": 85,
            "competitor_reaction": "String",
            "risk_matrix": {
                "financial": "High",
                "legal": "Low",
                "market": "Medium",
                "brand": "Low"
            }
          }
        ],
        "recommended_id": "1",
        "implementation_flowchart": {
          "nodes": [
            { "id": "1", "label": "Start", "type": "input" },
            { "id": "2", "label": "Action", "type": "process" }
          ],
          "edges": [
            { "source": "1", "target": "2", "label": "Next" }
          ]
        }
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const parsedData = JSON.parse(text);
      return NextResponse.json(parsedData);
    } catch (parseError) {
      return NextResponse.json({ error: "Twin Synchronization Failed (JSON Error)" }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}