const DISCORD_ID = "834852172486934539";

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = async cmd => {
  const r = await fetch(REDIS_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd)
  });
  return (await r.json()).result;
};

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "s-maxage=15, stale-while-revalidate=30");
  try {
    const l = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`).then(r => r.json());
    const act = l.success && l.data.activities.find(a => a.type === 0);

    if (act) {
      const rec = { name: act.name, at: Date.now() };
      await redis(["SET", "last_activity", JSON.stringify(rec)]);
      return res.status(200).json({ live: true, ...rec });
    }

    const saved = await redis(["GET", "last_activity"]);
    return res.status(200).json({ live: false, ...(saved ? JSON.parse(saved) : {}) });
  } catch (e) {
    return res.status(200).json({ live: false });
  }
};