const CHANNEL_ID = "UC9MqNFPCbpaESjw7wTuQXbA";

const decode = s => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=3600");
  try {
    const r = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`);
    if (!r.ok) throw new Error("feed gagal");
    const xml = await r.text();
    const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, 6).map(m => ({
      id: m[1].match(/<yt:videoId>(.*?)<\/yt:videoId>/)[1],
      title: decode(m[1].match(/<title>(.*?)<\/title>/)[1]),
      published: m[1].match(/<published>(.*?)<\/published>/)[1]
    }));
    res.status(200).json(videos);
  } catch (e) {
    res.status(502).json([]);
  }
};