const CHANNEL_ID = "UC9MqNFPCbpaESjw7wTuQXbA";   // diawali UC
const UPLOADS_ID = "UU" + CHANNEL_ID.slice(2); // daftar semua upload, alamat cadangan

const decode = s => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'");

const FEEDS = [
  `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
  `https://www.youtube.com/feeds/videos.xml?playlist_id=${UPLOADS_ID}`
];

module.exports = async (req, res) => {
  const errors = [];
  for (const url of FEEDS) {
    try {
      const r = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; Orennn12Site/1.0)" }
      });
      if (!r.ok) { errors.push(r.status + " " + url.split("?")[1]); continue; }
      const xml = await r.text();
      const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, 6).map(m => ({
        id: m[1].match(/<yt:videoId>(.*?)<\/yt:videoId>/)[1],
        title: decode(m[1].match(/<title>(.*?)<\/title>/)[1]),
        published: m[1].match(/<published>(.*?)<\/published>/)[1]
      }));
      res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=3600");
      return res.status(200).json(videos);
    } catch (e) {
      errors.push(String(e.message));
    }
  }
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ error: errors });
};
