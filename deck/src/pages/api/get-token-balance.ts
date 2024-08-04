import { getDatabase } from '../../lib/databaseFactory';
import { getAuth } from '@clerk/nextjs/server';

const db = getDatabase();

export default async function handler(req, res) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const db = getDatabase();

  try {
    const tokenBalance = await db.getTokenBalanceByUserId(userId);
    res.status(200).json({ tokenBalance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
