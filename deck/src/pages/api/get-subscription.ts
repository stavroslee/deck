import { getAuth } from "@clerk/nextjs/server";
import { getDatabase } from '../../lib/databaseFactory';

async function handler(req, res) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const db = getDatabase();

  try {
    const subscription = await db.getSubscriptionByUserId(userId);

    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    res.status(200).json({ subscription });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default handler;
