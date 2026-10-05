const CHANNEL_ID = "UC9MqNFPCbpaESjw7wTuQXbA";
const UPLOADS_ID = "UU" + CHANNEL_ID.slice(2);

module.exports = async (req, res) => {
  try {
    const key = process.env.YOUTUBE_API_KEY;
    if (!key) throw new Error("YOUTUBE_API_KEY belum diisi");

    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=6&playlistId=${UPLOADS_ID}&key=${key}`;
    const r = await fetch(url);
    const j = await r.json();
    if (!r.ok) throw new Error(j.error?.message || "API error " + r.status);

    const videos = j.items.map(i => ({
      id: i.snippet.resourceId.videoId,
      title: i.snippet.title,
      published: i.snippet.publishedAt
    }));
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=3600");
    res.status(200).json(videos);
  } catch (e) {
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ error: String(e.message) });
  }
};