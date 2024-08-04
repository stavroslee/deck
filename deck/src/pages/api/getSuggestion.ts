// src/api/getSuggestion.js
import { getDatabase } from '@/lib/databaseFactory';
import { getAuth } from '@clerk/nextjs/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

let charactersPerToken = 3.5; //rough estimate of how many tokens we spend per character
let toKiloTokens = 1000; //1000 tokens = 1 kilotoken

export default async function handler(req, res) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const db = getDatabase();
  
  if (req.method === 'POST') {
    const { context } = req.body;

    const tokenBalance = await db.getTokenBalanceByUserId(userId);

    console.log(`${context.length} characters`);
    //estimate token cost from character length
    const estimatedTokenCost = Math.ceil(context.length / (charactersPerToken * toKiloTokens));

    if (tokenBalance < estimatedTokenCost) {
      console.log(`Insufficient tokens: ${tokenBalance} < ${estimatedTokenCost}`);
      return res.status(400).json({ error: 'Insufficient tokens' });
    }

    await db.deductTokenBalanceByUserId(userId, estimatedTokenCost);

    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: 'user', content: context }],
      model: 'gpt-4o-mini',
    });

    //$0.150 / 1M input tokens - so I'm charging $0.9 / 1M input tokens
    //6x
    //$0.600 / 1M output tokens 3.6$ / 1M output tokens
    //1000 tokens
    //@5000 tokens / click thats 200 per $.9 - so at 5$/month 1100 clicks / month

    console.log(chatCompletion.usage);
    //lets round to the nearest 1000 tokens
    const actualTokenCost = Math.ceil((chatCompletion.usage?.total_tokens || 100)/1000);
    console.log(`Token cost: ${actualTokenCost} vs ${estimatedTokenCost}`);
    const profit = estimatedTokenCost - actualTokenCost; //negative if we charged to little so 8 vs 10 would be -2
    charactersPerToken = profit < 0 ? charactersPerToken + profit : charactersPerToken; //4 - 2 = 2
    const suggestion = chatCompletion.choices[0].message.content;

    res.status(200).json({ suggestion });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

/*
export default async function getSuggestion(input: string) {
  const response = await fetch(`https://api.datamuse.com/sug?s=${input}`);
  const data = await response.json();
  return data;
}
*/