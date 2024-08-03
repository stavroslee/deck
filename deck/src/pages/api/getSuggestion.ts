
// src/api/getSuggestion.js
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { context } = req.body;

    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: 'user', content: context }],
      model: 'gpt-4o-mini',
    });

    console.log(chatCompletion.usage);

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