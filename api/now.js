const { createClient } = require("redis");

const DISCORD_ID = "834852172486934539";

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "s-maxage=15, stale-while-revalidate=30");
  let redis;
  try {
    redis = await createClient({ url: process.env.REDIS_URL }).connect();

    const l = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`).then(r => r.json());
    const act = l.success && l.data.activities.find(a => a.type === 0);

    if (act) {
      const rec = { name: act.name, at: Date.now() };
      await redis.set("last_activity", JSON.stringify(rec));
      return res.status(200).json({ live: true, ...rec });
    }

    const saved = await redis.get("last_activity");
    return res.status(200).json({ live: false, ...(saved ? JSON.parse(saved) : {}) });
  } catch (e) {
    return res.status(200).json({ live: false });
  } finally {
    if (redis) await redis.quit().catch(() => {});
  }
};