const CHANNEL_ID = "UC9MqNFPCbpaESjw7wTuQXbA";

const decode = s => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'");

export async function onRequest() {
  const headers = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=1800" };
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`, {
      cf: { cacheTtl: 1800, cacheEverything: true }
    });
    if (!res.ok) throw new Error("feed gagal");
    const xml = await res.text();
    const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, 6).map(m => ({
      id: m[1].match(/<yt:videoId>(.*?)<\/yt:videoId>/)[1],
      title: decode(m[1].match(/<title>(.*?)<\/title>/)[1]),
      published: m[1].match(/<published>(.*?)<\/published>/)[1]
    }));
    return new Response(JSON.stringify(videos), { headers });
  } catch (e) {
    return new Response("[]", { status: 502, headers });
  }
}